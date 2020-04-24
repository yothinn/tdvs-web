import { FuseNavigation } from '@fuse/types';

export const navigation: FuseNavigation[] = [
    {
        id: 'Menu',
        title: 'Menu Order',
        translate: 'ใบสั่งงาน',
        type: 'group',
        children: [
            {
                id: 'order',
                title: 'order',
                translate: 'รายการใบสั่งงาน',
                type: 'item',
                icon: 'description',
                url: '/order'
            },
            {
                id: 'joborder',
                title: 'joborder',
                translate: 'รายการใบสั่งงาน(new)',
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
    }
];
