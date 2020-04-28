import { FuseNavigation } from '@fuse/types';

export const navigation: FuseNavigation[] = [
    {
        id: 'Menu',
        title: 'Menu Order',
        translate: 'ใบสั่งงาน',
        type: 'group',
        children: [
            // {
            //     id: 'order',
            //     title: 'order',
            //     translate: 'รายการใบสั่งงาน',
            //     type: 'item',
            //     icon: 'description',
            //     url: '/order'
            // },
            {
                id: 'joborder',
                title: 'joborder',
                translate: 'รายการใบสั่งงาน',
                type: 'item',
                icon: 'description',
                url: '/joborder'
            }
        ]
    },
    // {
    //     id: 'Menu',
    //     title: 'Menu IPI',
    //     translate: 'ข้อมูลสมาชิก',
    //     type: 'group',
    //     children: [
    //         {
    //             id: 'involvedparty',
    //             title: 'involvedparty',
    //             translate: 'รายการข้อมูลสมาชิก',
    //             type: 'item',
    //             icon: 'account_box',
    //             url: '/involvedparty'
    //         }
    //     ]
    // },
    {
        id: 'Menu',
        title: 'Menu IPI',
        translate: 'ข้อมูลสมาชิก',
        type: 'group',
        children: [
            {
                id: 'tvdscustomer',
                title: 'tvdscustomer',
                translate: 'รายการข้อมูลสมาชิก',
                type: 'item',
                icon: 'account_box',
                url: '/tvdscustomer'
            }
        ]
    },
    {
        id: 'Menu Vehicle',
        title: 'Menu Vehicle',
        translate: 'การจัดการรถ',
        type: 'group',
        children: [
            {
                id: 'vehicle',
                title: 'vehicle',
                translate: 'รายการข้อมูลการจัดการรถ',
                type: 'item',
                icon: 'directions_car',
                url: '/vehicle'
            }
        ]
    },
    {
        id: 'Menu vehicledata',
        title: 'Menu vehicledata',
        translate: 'ข้อมูลรถ',
        type: 'group',
        children: [
            {
                id: 'vehicledata',
                title: 'vehicledata',
                translate: 'รายการข้อมูลรถ',
                type: 'item',
                icon: 'directions_car',
                url: '/vehicledata'
            }
        ]
    }
];
