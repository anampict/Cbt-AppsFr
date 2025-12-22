import {
    PiHouseLineDuotone,
    PiArrowsInDuotone,
    PiBookOpenUserDuotone,
    PiBookBookmarkDuotone,
    PiAcornDuotone,
    PiBagSimpleDuotone,
    PiGraduationCapDuotone,
    PiGlobeDuotone,
    PiUser,
    PiTimerDuotone
} from 'react-icons/pi'
import type { JSX } from 'react'

export type NavigationIcons = Record<string, JSX.Element>

const navigationIcon: NavigationIcons = {
    home: <PiHouseLineDuotone />,
    // singleMenu: <PiAcornDuotone />,
    singleMenu: <PiGraduationCapDuotone />,
    collapseMenu: <PiArrowsInDuotone />,
    groupSingleMenu: <PiBookOpenUserDuotone />,
    groupCollapseMenu: <PiGlobeDuotone />,
    user: <PiUser />,
    paket: <PiTimerDuotone/>
}

export default navigationIcon
