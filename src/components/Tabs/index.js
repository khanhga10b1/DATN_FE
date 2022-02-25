import React, { useState} from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import '../../scss/components/_tabs.scss';
import styled from 'styled-components';
import Ripple from '../Ripple';
import Feather from "../Feather";

const StyledTab = styled.div`
    width : 100%;
    .tab__highlight {
        left: ${p => p.left}px !important;
        width: ${p => p.width}px !important;
    }
    .animate-panel {
        display: block;
    }
    ul {
        display : flex;
        li {
            padding : 5px 15px;
            cursor : pointer;
            text-align : center;
            min-width : 200px;
        }
    }
`;

const TabComponent = ({ tabsFormat = content => content,vertical=false, ...props }) => {
    const [left, setLeft] = useState(0);
    const [width, setWidth] = useState(140);

    const panel = props.children.map((comp, i) => (
        <TabPanel className='animate-panel' key={i}>
            {comp}
        </TabPanel>
    ));

    return (
        <StyledTab left={left} width={width} className='user-tabWrapper'>
            <Tabs>
                <TabList className='tab-list'>
                    {props.tabs.map((tab, i) => (
                        <Tab
                            className='ripple__container'
                            key={i}
                            onClick={e => {
                                setLeft(e.target.offsetParent.offsetLeft);
                                setWidth(e.target.offsetWidth);
                            }}>
                            {typeof tab === 'object' ? (
                                <>
                                    {tab.icon && <Feather name={tab.icon} />}
                                    <span>{tab.name}</span>
                                </>
                            ) : (
                                <span>{tab}</span>
                            )}
                            <Ripple color={'#ff89397a'} duration={750} />
                        </Tab>
                    ))}
                </TabList>
                {tabsFormat(panel)}
            </Tabs>
        </StyledTab>
    );
};

export default TabComponent;
