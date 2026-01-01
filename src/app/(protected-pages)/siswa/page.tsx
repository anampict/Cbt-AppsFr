import React from "react";

const SiswaPage = () => {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold">Manajemen Siswa</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Kelola data siswa di sekolah Anda
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8">
        <div className="text-center">
          <h3 className="text-xl font-semibold mb-4">
            Halaman Manajemen Siswa
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Fitur manajemen siswa akan tersedia segera. Di sini Anda dapat
            menambah, mengedit, dan menghapus data siswa.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SiswaPage;
