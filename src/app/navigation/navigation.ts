import { FuseNavigation } from '@fuse/types';

export const navigation: FuseNavigation[] = [
    {
        id: 'Menu',
        title: 'Menu Order',
        translate: 'การจัดการใบสั่งงาน',
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
                translate: 'จัดทำใบสั่งงาน',
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
        id: 'Menu Vehicle',
        title: 'Menu Vehicle',
        translate: 'การจัดการพาหนะ',
        type: 'group',
        children: [
            {
                id: 'vehicle',
                title: 'vehicle',
                translate: 'ตารางรถให้บริการ',
                type: 'item',
                icon: 'directions_car',
                url: '/vehicle'
            },
            {
                id: 'vehicledata',
                title: 'vehicledata',
                translate: 'ปรับปรุงข้อมูลพาหนะ',
                type: 'item',
                icon: 'directions_car',
                url: '/vehicledata'
            }
        ]
    },
    // {
    //     id: 'Menu vehicledata',
    //     title: 'Menu vehicledata',
    //     translate: 'ข้อมูลรถ',
    //     type: 'group',
    //     children: [
    //         {
    //             id: 'vehicledata',
    //             title: 'vehicledata',
    //             translate: 'รายการข้อมูลรถ',
    //             type: 'item',
    //             icon: 'directions_car',
    //             url: '/vehicledata'
    //         }
    //     ]
    // },
    {
        id: 'Menu',
        title: 'Menu IPI',
        translate: 'ข้อมูลลูกค้าและประวัติ',
        type: 'group',
        children: [
            {
                id: 'tvdscustomer',
                title: 'tvdscustomer',
                translate: 'ปรับปรุงข้อมูลลูกค้า',
                type: 'item',
                icon: 'account_box',
                url: '/tvdscustomer'
            }
        ]
    },
];
