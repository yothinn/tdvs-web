import { FuseNavigation } from '@fuse/types';

export const navigation: FuseNavigation[] = [
    {
        id: 'Menu',
        title: 'Menu',
        translate: 'เมนู',
        type: 'group',
        children: [
            {
                id: 'order',
                title: 'order',
                translate: 'จัดการใบสั่งงาน',
                type: 'item',
                icon: 'description',
                url: '/order'
            },
            {
                id: 'involvedparty',
                title: 'involvedparty',
                translate: 'จัดการข้อมูลสมาชิก',
                type: 'item',
                icon: 'account_box',
                url: '/involvedparty'
            }
        ]
    }
];
