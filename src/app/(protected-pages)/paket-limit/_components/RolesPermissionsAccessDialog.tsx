"use client";
import { useMemo, useState, useRef } from "react";
import Button from "@/components/ui/Button";
import Avatar from "@/components/ui/Avatar";
import Segment from "@/components/ui/Segment";
import Dialog from "@/components/ui/Dialog";
import Input from "@/components/ui/Input";
import ScrollBar from "@/components/ui/ScrollBar";
import { FormItem } from "@/components/ui/Form";
import hooks from "@/components/ui/hooks";
import { useRolePermissionsStore } from "../_store/rolePermissionsStore";
import { accessModules } from "../constants";
import classNames from "@/utils/classNames";
import isLastChild from "@/utils/isLastChild";
import sleep from "@/utils/sleep";
import {
  TbUserCog,
  TbBox,
  TbSettings,
  TbFiles,
  TbFileChart,
  TbCheck,
  TbEye,
  TbEyeOff,
} from "react-icons/tb";
import type { ReactNode } from "react";
import Select from "@/components/ui/Select/Select";

const moduleIcon: Record<string, ReactNode> = {
  users: <TbUserCog />,
  products: <TbBox />,
  configurations: <TbSettings />,
  files: <TbFiles />,
  reports: <TbFileChart />,
};

const { useUniqueId } = hooks;

const RolesPermissionsAccessDialog = () => {
  const roleList = useRolePermissionsStore((state) => state.roleList);
  const setRoleList = useRolePermissionsStore((state) => state.setRoleList);

  const setRoleDialog = useRolePermissionsStore((state) => state.setRoleDialog);
  const setSelectedRole = useRolePermissionsStore(
    (state) => state.setSelectedRole
  );

  const selectedRole = useRolePermissionsStore((state) => state.selectedRole);
  const roleDialog = useRolePermissionsStore((state) => state.roleDialog);

  const [accessRight, setAccessRight] = useState<Record<string, string[]>>({});
  const [showPassword, setShowPassword] = useState(false);

  const roleNameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);

  const newId = useUniqueId("role-");

  const colourOptions = [
    { value: "ocean", label: "SuperAdmin", color: "#00B8D9" },
    { value: "blue", label: "Admin Sekolah", color: "#0052CC" },
  ];

  const handleClose = () => {
    setRoleDialog({
      type: "",
      open: false,
    });
    setShowPassword(false);
  };

  const handleUpdate = async () => {
    handleClose();
    await sleep(300);
    setSelectedRole("");
  };

  const handleSubmit = async () => {
    const newRoleList = structuredClone(roleList);
    newRoleList.push({
      id: newId,
      name: roleNameRef.current?.value || `Untitle-${newId}`,
      email: emailRef.current?.value || "",
      password: passwordRef.current?.value || "",
      description: descriptionRef.current?.value || "",
      users: [],
      accessRight,
    });
    setRoleList(newRoleList);
    handleClose();
  };

  const modules = useMemo(() => {
    return roleList.find((role) => role.id === selectedRole);
  }, [selectedRole, roleList]);

  const handleChange = (accessRight: string[], key: string) => {
    if (roleDialog.type === "new") {
      setAccessRight((value) => {
        value[key] = accessRight;
        return value;
      });
    }

    if (roleDialog.type === "edit") {
      const newRoleList = structuredClone(roleList).map((role) => {
        if (role.id === selectedRole) {
          role.accessRight[key] = accessRight;
        }

        return role;
      });

      setRoleList(newRoleList);
    }
  };

  return (
    <Dialog
      isOpen={roleDialog.open}
      width={900}
      onClose={handleClose}
      onRequestClose={handleClose}
    >
      <h4>{roleDialog.type === "new" ? "Tambah Admin" : modules?.name}</h4>
      <ScrollBar className="mt-6 max-h-[500px] overflow-y-auto overflow-x-visible">
        <div className="px-4 pb-4">
          {roleDialog.type === "new" && (
            <>
              <FormItem label="Nama">
                <Input ref={roleNameRef} />
              </FormItem>
              <FormItem label="Email">
                <Input ref={emailRef} type="email" />
              </FormItem>
              <FormItem label="Password">
                <div className="relative">
                  <Input
                    ref={passwordRef}
                    type={showPassword ? "text" : "password"}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 cursor-pointer text-xl"
                  >
                    {showPassword ? <TbEyeOff /> : <TbEye />}
                  </button>
                </div>
              </FormItem>
              <FormItem label="Role" className="mb-40">
                <Select
                  instanceId="basic"
                  placeholder="Please Select"
                  options={colourOptions}
                  menuPosition="fixed"
                  styles={{
                    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                  }}
                  menuPortalTarget={
                    typeof document !== "undefined" ? document.body : null
                  }
                />
              </FormItem>
            </>
          )}
        </div>
      </ScrollBar>
      <div className="flex justify-end mt-3 px-4 pb-6 pt-4">
        <Button
          className="ltr:mr-2 rtl:ml-2 "
          customColorClass={() =>
            "border-error ring-1 ring-error text-error hover:border-error hover:ring-error hover:text-error bg-transparent"
          }
          variant="plain"
          onClick={handleClose}
        >
          Cancel
        </Button>
        <Button
          variant="solid"
          onClick={roleDialog.type === "edit" ? handleUpdate : handleSubmit}
        >
          {roleDialog.type === "edit" ? "Update" : "Tambah"}
        </Button>
      </div>
    </Dialog>
  );
};

export default RolesPermissionsAccessDialog;
