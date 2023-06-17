/**
 * 共用服務 Context
 */
import { useResponseVO } from 'Hook/useTools.jsx';
import React, { createContext, useEffect } from 'react';

// 查詢「分類」設定值
const fetchCategoryListFunc = () => fetch("service/config?code=CATEGORY", {
    method: 'GET', redirect: 'manual',
});

// 查詢所有「下拉清單」設定值
const fetchDropdownsFunc = () => fetch("service/config/dropdowns", {
    method: 'GET', redirect: 'manual',
});

// 查詢所有「圖示下拉清單」設定值
const fetchIconDropdownsFunc = () => fetch("service/config/iconDropdowns", {
    method: 'GET', redirect: 'manual',
});

// 查詢所有「階層式下拉清單」設定值
const fetchHierarchicalDropdownsFunc = () => fetch("service/config/hierarchicalDropdowns", {
    method: 'GET', redirect: 'manual',
});

export const ServiceContext = createContext();

export const ServiceContextProvider = props => {
    const categoryList = useResponseVO(fetchCategoryListFunc);
    const dropdowns = useResponseVO(fetchDropdownsFunc);
    const iconDropdowns = useResponseVO(fetchIconDropdownsFunc);
    const hierarchicalDropdowns = useResponseVO(fetchHierarchicalDropdownsFunc);

    useEffect(() => {
        categoryList.execute({ convertDataToObject: true });
        dropdowns.execute();
        iconDropdowns.execute();
        hierarchicalDropdowns.execute();
    }, []);

    return (
        <ServiceContext.Provider value={{ categoryList, dropdowns, iconDropdowns, hierarchicalDropdowns }}>
            {props.children}
        </ServiceContext.Provider>
    );
};
