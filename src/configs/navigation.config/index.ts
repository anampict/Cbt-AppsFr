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
        authority: [],
        subMenu: [
            {
                key: 'sekolah',
                path: '/sekolah',
                title: 'Daftar Sekolah',
                translateKey: 'nav.sekolah',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
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
                authority: [],
                subMenu: [
                    {
                        key: 'domain',
                        path: '/domain',
                        title: 'Daftar Domain',
                        translateKey: 'nav.domain',
                        icon: '',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [],
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
        authority: [],
        subMenu: [],
    },
    {
        key: 'paket-limit',
        path: '/paket-limit',
        title: 'Paket Dan Limit',
        translateKey: 'nav.manajemenadmin',
        icon: 'paket',
        type: NAV_ITEM_TYPE_ITEM,
        authority: [],
        subMenu: [],
    },
]

export default navigationConfig
