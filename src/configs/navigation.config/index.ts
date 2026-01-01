import {
    NAV_ITEM_TYPE_TITLE,
    NAV_ITEM_TYPE_ITEM,
    NAV_ITEM_TYPE_COLLAPSE,
} from '@/constants/navigation.constant'

import type { NavigationTree } from '@/@types/navigation'

const navigationConfig: NavigationTree[] = [
    {
        key: 'home',
        path: '/home',
        title: 'Home',
        translateKey: 'nav.home',
        icon: 'home',
        type: NAV_ITEM_TYPE_ITEM,
        authority: [],
        subMenu: [],
    },
    {
        key: 'sekolah',
        path: '',
        title: 'Manajemen Sekolah',
        translateKey: 'nav.sekolah',
        icon: 'singleMenu',
        type: NAV_ITEM_TYPE_COLLAPSE,
        authority: ['SUPERADMIN'], // Hanya untuk SUPERADMIN
        subMenu: [
            {
                key: 'sekolah',
                path: '/sekolah',
                title: 'Daftar Sekolah',
                translateKey: 'nav.sekolah',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                authority: ['SUPERADMIN'],
                subMenu: [],
            },
        ],
    },
    {
                key: 'domain',
                path: '/domain',
                title: 'Manajemen Domain',
                translateKey: 'nav.domain',
                icon: 'groupCollapseMenu',
                type: NAV_ITEM_TYPE_COLLAPSE,
                authority: ['SUPERADMIN'], // Hanya untuk SUPERADMIN
                subMenu: [
                    {
                        key: 'domain',
                        path: '/domain',
                        title: 'Daftar Domain',
                        translateKey: 'nav.domain',
                        icon: '',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: ['SUPERADMIN'],
                        subMenu: [],
                    },
                ],
            },
    {
        key: 'manajemenadmin',
        path: '/manajemenadmin',
        title: 'Manajemen Admin',
        translateKey: 'nav.manajemenadmin',
        icon: 'user',
        type: NAV_ITEM_TYPE_ITEM,
        authority: ['SUPERADMIN'], // Hanya untuk SUPERADMIN
        subMenu: [],
    },
    {
        key: 'paket-limit',
        path: '/paket-limit',
        title: 'Paket Dan Limit',
        translateKey: 'nav.manajemenadmin',
        icon: 'paket',
        type: NAV_ITEM_TYPE_ITEM,
        authority: ['SUPERADMIN'], // Hanya untuk SUPERADMIN
        subMenu: [],
    },
    {
        key: 'maintenance',
        path: '/maintenance',
        title: 'Maintenance',
        translateKey: 'nav.maintenance',
        icon: 'maintenance',
        type: NAV_ITEM_TYPE_ITEM,
        authority: ['SUPERADMIN'], // Hanya untuk SUPERADMIN
        subMenu: [],
    },
    // Menu untuk ADMIN_SEKOLAH
    {
        key: 'guru',
        path: '/guru',
        title: 'Manajemen Guru',
        translateKey: 'nav.guru',
        icon: 'guru',
        type: NAV_ITEM_TYPE_ITEM,
        authority: ['ADMIN_SEKOLAH'], // Hanya untuk ADMIN_SEKOLAH
        subMenu: [],
    },
    {
        key: 'mapel',
        path: '/mapel',
        title: 'Manajemen Mapel',
        translateKey: 'nav.mapel',
        icon: 'mapel',
        type: NAV_ITEM_TYPE_ITEM,
        authority: ['ADMIN_SEKOLAH'], // Hanya untuk ADMIN_SEKOLAH
        subMenu: [],
    },
    {
        key: 'kelas',
        path: '/kelas',
        title: 'Manajemen Kelas',
        translateKey: 'nav.kelas',
        icon: 'kelas',
        type: NAV_ITEM_TYPE_ITEM,
        authority: ['ADMIN_SEKOLAH'], // Hanya untuk ADMIN_SEKOLAH
        subMenu: [],
    },
    {
        key: 'siswa',
        path: '/siswa',
        title: 'Manajemen Siswa',
        translateKey: 'nav.siswa',
        icon: 'siswa',
        type: NAV_ITEM_TYPE_ITEM,
        authority: ['ADMIN_SEKOLAH'], // Hanya untuk ADMIN_SEKOLAH
        subMenu: [],
    },
]

export default navigationConfig
