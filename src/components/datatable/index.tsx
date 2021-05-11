import React, { forwardRef, useRef, useEffect, useState } from 'react';
import { useTable, useSortBy, usePagination, useRowSelect } from 'react-table';
import ClickOutside from 'react-click-outside';
import * as Icon from 'react-feather';
import { Button } from 'components/buttons';
import { PageWithText } from '../pagination';

const IndeterminateCheckbox = forwardRef(
  ({ indeterminate, ...rest }: any, ref: any) => {
    const defaultRef = useRef();
    const resolvedRef = ref || defaultRef;

    useEffect(() => {
      resolvedRef.current.indeterminate = indeterminate;
    }, [resolvedRef, indeterminate]);

    return (
      <input
        type="checkbox"
        ref={resolvedRef}
        {...rest}
        className="form-checkbox h-4 w-4"
      />
    );
  }
);

const Datatable: React.FunctionComponent<any> = (props: any) => {
  const [ columns, setColumns ] = useState(props.columns);
  const [ columnStatus, setColumnStatus ] = useState(props.columns.reduce((o, val, key) => { o[key] = true;

  return o; }, {}));
  const [ filteredData, setFilteredData ] = useState(props.data);
  const [ data, setData ] = useState(filteredData);
  const [ keyword, setKeyword ] = useState('');
  const [ openColumnFilterDropdown, setOpenColumnFilterDropdown ] = useState(false);
  const expandRow = typeof props.expandRow !== 'undefined' ? props.expandRow : false;
  let initialPageSize = 10;
  if(typeof props.noPagination !== 'undefined'){
    initialPageSize = 1000;
  }
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: {
      pageIndex,
      pageSize
    }
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: initialPageSize },
    },
    useSortBy,
    usePagination,
    useRowSelect,
    (hooks: any) => {
      if(props.rowSelectable){
        hooks.visibleColumns.push((cols: any) => [
          {
            id: 'selection',
            Header: ({ getToggleAllRowsSelectedProps }: any) => (
              <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
            ),
            Cell: ({ row }: any) => (
              <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
            ),
          },
          ...cols,
        ]);
      }
    }
  );
  useEffect(() => {
    setData(props.data);
  }, [ props.data ]);
  useEffect(() => {
    setData(filteredData.filter((row) => {
      let isContain = false;
      Object.keys(row).forEach((key) => {
        if((row[key] !== null) && (row[key].toString().toLowerCase().includes(keyword.toLowerCase()))){
          isContain = true;
        }
      });

      return isContain;
    }));
  }, [ keyword, filteredData ]);
  useEffect(() => {
    setColumns(props.columns.filter((el, key) => columnStatus[key] === true));
  }, [ columnStatus ]);
  const handleFilterColumn = (filterOptionKey):void => {
    if(filterOptionKey === '-1'){
      setFilteredData(props.data);
    }else{
      setFilteredData(props.data.filter((el) => props.filterOptions[filterOptionKey].option(el)));
    }
  }

  return (
    <div className="datatable-container">
      <div className="datatable-header-wrapper">
        <div className="datatable-header-left">
          {typeof props.headerLeft !== 'undefined' &&
            props.headerLeft
          }
        </div>
        <div className="datatable-header-right">
          { props.searchable &&
            <input
              className="form-input text-xs block border w-48 px-2 py-1 ml-2"
              placeholder="Search"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          }
          {props.filterOptions &&
            <select
              className="form-select text-xs block border w-48 px-2 py-1 ml-2"
              placeholder="Filter Columns"
              onChange={(e) => handleFilterColumn(e.target.value)}
            >
              <option value={-1}>All</option>
              {props.filterOptions.map((el, key) => (
                <option value={key} key={key}>{el.label}</option>
              ))}
            </select>
          }
          {
            props.customColumnable &&
            <div className="relative flex items-center ml-4">
              <Button
                flat
                icon
                leftIcon="Settings"
                onClick={() => setOpenColumnFilterDropdown(!openColumnFilterDropdown)}
              />
              {
                openColumnFilterDropdown &&
                <ClickOutside onClickOutside={() => setOpenColumnFilterDropdown(false)}>
                  <div className="column-filter-dropdown-wrapper">
                    {
                      props.columns.map((el, key) => (
                        <div key={key} className="column-filter-dropdown-item">
                          <label className="inline-flex items-center children-x-2">
                            <input
                              type="checkbox"
                              className="form-checkbox h-4 w-4"
                              defaultChecked={columnStatus[key]}
                              onChange={() => setColumnStatus({...columnStatus, [key]: !columnStatus[key]})}
                            />
                            <span>{el.Header}</span>
                          </label>
                        </div>
                      ))
                    }
                  </div>
                </ClickOutside>
              }
            </div>
          }
        </div>
      </div>
      <table {...getTableProps()} className="table">
        <thead>
          {headerGroups.map((headerGroup: any, key1) => (
            <tr key={key1} {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column: any, key2) => (
                <th key={key2} {...column.getHeaderProps(column.getSortByToggleProps())}>
                  <div className="flex flex-row items-center justify-start">
                    <span>{column.render('Header')}</span>
                    <span className="ltr:ml-auto rtl:mr-auto">
                      {column.isSorted ? (
                        column.isSortedDesc ? (
                          <i className="icon-arrow-down text-xxs" />
                        ) : (
                          <i className="icon-arrow-up text-xxs" />
                        )
                      ) : (
                        ''
                      )}
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {(expandRow !== false && expandRow.index === -1) && // if expand row index is -1
            <tr style={{backgroundColor: '#EEF0FB'}}>
              <td colSpan={columns.length} style={{padding: 0}}>
                <div>
                  {expandRow.content}
                </div>
              </td>
            </tr>
          }
          {(props.data.length === 0 && !expandRow) &&
            <tr>
              <td colSpan={columns.length}>
                <div className="flex justify-center items-center p-2">
                  No record
                </div>
              </td>
            </tr>
          }
          {page.map((row, key1) => {
            prepareRow(row);

            return (
              <React.Fragment key={key1}>
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell, key2) => (
                    <td key={key2} {...cell.getCellProps()}>{cell.render('Cell')}</td>
                  ))}
                </tr>
                {expandRow !== false && expandRow.index === key1 && // if expand row is assigned to this row,
                  <tr style={{backgroundColor: '#EEF0FB'}}>
                    <td colSpan={columns.length} style={{padding: 0}}>
                      <div>
                        {expandRow.content}
                      </div>
                    </td>
                  </tr>
                }
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
      {
        (typeof props.noPagination === 'undefined' && props.data.length > 10) && (
          <div className="flex flex-row items-center justify-between my-4">
            <div className="flex flex-wrap items-center justify-start children-x-2 pagination">
              <PageWithText
                onClick={() => gotoPage(0)}
                active={pageIndex === 0}
              >
                <Icon.ChevronsLeft size={16} />
              </PageWithText>
              <PageWithText
                onClick={() => previousPage()}
                active={!canPreviousPage}
              >
                <Icon.ChevronLeft size={16} />
              </PageWithText>
              <PageWithText
                onClick={() => nextPage()}
                disabled={!canNextPage}
                active={!canNextPage}
              >
                <Icon.ChevronRight size={16} />
              </PageWithText>
              <PageWithText
                onClick={() => gotoPage(pageCount - 1)}
                disabled={!canNextPage}
                active={pageIndex === pageCount - 1}
              >
                <Icon.ChevronsRight size={16} />
              </PageWithText>
            </div>
            <span>
              Page {/* eslint-disable @typescript-eslint/restrict-plus-operands */}
              {pageIndex + 1} of {pageOptions.length}{' '}
            </span>
            <select
              className="form-select text-xs py-1 pl-2 pr-6"
              value={pageSize}
              onChange={(e: any) => {
                setPageSize(Number(e.target.value));
              }}
            >
              {[10, 25, 50, 100].map((pageSizeOption) => (
                <option key={pageSizeOption} value={pageSizeOption}>
                  Show {pageSizeOption}
                </option>
              ))}
            </select>
          </div>
        )
      }
    </div>
  );
};

export default Datatable;