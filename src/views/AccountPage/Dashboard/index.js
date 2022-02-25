import React, { useState } from 'react';
import '../../../scss/pages/_setup.scss';
import styled from 'styled-components';
import { Ripple, Feather } from '../../../components';

const SubMenu = styled.div`
    .setup--show {
        max-height: ${p => p.maxHeight * 60 + 20}px;
        transition: 0.25s ease;
    }
`;

const menu = [
    {
        id: 1,
        title: 'Thống kê',
        icon: 'Grid',
        children: [],
        component: React.lazy(() => import('./Dashboard'))
    },
    {
        id: 2,
        title: 'Khách sạn',
        icon: 'Home',
        children: [
            {
                id: 3,
                title: 'Thông tin ',
                children: [],
                component: React.lazy(() => import('../Hotels'))
            },
            {
                id: 4,
                title: 'Phòng',
                children: [],
                component: React.lazy(() => import('../Rooms'))
            },
            {
                id: 5,
                title: 'Đơn phòng',
                children: [],
                component: React.lazy(() => import('../Reservations'))
            }
        ]
    },
    {
        id: 7,
        title: 'Đơn của bạn ',
        icon: 'Calendar',
        children: [],
        component: React.lazy(() => import('../MyReservations'))
    },
    {
        id: 6,
        title: 'Tài khoản',
        icon: 'Settings',
        children: [],
        component: React.lazy(() => import('../Profile'))
    }
  
];
const Setup = () => {
    const [selectedMenu, setSelectedMenu] = useState(1);
    const [selectedSub, setSelectedSub] = useState(-1);

    const renderMenu = menu.find(item => item.id === selectedMenu);
    const renderSubmenu = renderMenu.children.find(child => child.id === selectedSub);
    return (
        <div className='setup'>
            <div className='content'>
                <div className='leftbar '>
                    <div>
                        {menu.map(item => (
                            <React.Fragment key={item.id}>
                                <div
                                    className={`ripple__container menu__block ${
                                        item.id == selectedMenu ? 'menu__block--selected' : ''
                                    }`}
                                    onClick={() => {
                                        setSelectedMenu(item.id);
                                        if (item.children.length > 0) setSelectedSub(item.children[0].id);
                                    }}>
                                    {item.icon && <Feather name={item.icon} />}
                                    <span>{item.title}</span>
                                    <Ripple color={'#c1c1c1'} duration={750} />
                                </div>
                                <SubMenu maxHeight={item.children?.length || 0}>
                                    <div className={`${item.id === selectedMenu ? 'setup--show' : 'setup--hide'}`}>
                                        {item.children?.map(child => (
                                            <div
                                                key={child.id}
                                                className={`ripple__container menu__block menu__block__sub ${
                                                    child.id === selectedSub ? 'menu__block__sub--selected' : ''
                                                }`}
                                                onClick={() => {
                                                    setSelectedSub(child.id);
                                                }}>
                                                {child.icon && <Feather name={child.icon} />}
                                                <span>{child.title}</span>
                                                <Ripple color={'#c1c1c1'} duration={750} />
                                            </div>
                                        ))}
                                    </div>
                                </SubMenu>
                            </React.Fragment>
                        ))}
                    </div>
                </div>
                <div className='main-menu'>
                    {renderMenu ? (
                        renderMenu.children.length === 0 ? (
                            renderMenu.component ? (
                                <React.Suspense fallback={''}>
                                    <renderMenu.component />
                                </React.Suspense>
                            ) : null
                        ) : renderSubmenu ? (
                            renderSubmenu.component ? (
                                <React.Suspense fallback={'...'}>
                                    <renderSubmenu.component />
                                </React.Suspense>
                            ) : null
                        ) : null
                    ) : null}
                </div>
            </div>
        </div>
    );
};

export default Setup;
