import React, { useState } from 'react';

type DefaultTabsProps = {
  readonly tabs: readonly {
    readonly index: number;
    readonly content?: React.ReactElement;
    readonly title?: any;
  }[];
};

export const DefaultTabs: React.FunctionComponent<DefaultTabsProps> = ({
  tabs,
}: DefaultTabsProps) => {
  const [openTab, setOpenTab] = useState(0);

  return (
    <div className="flex flex-wrap flex-col w-full tabs">
      <div className="flex flex-wrap flex-row children-x-2">
        {tabs.map((tab, key) => (
          <div key={key} className="flex-none">
            <button
              onClick={() => {
                setOpenTab(tab.index);
              }}
              className={`tab ${openTab === tab.index ? 'tab-active' : ''}`}
              type="button"
            >
              {tab.title}
            </button>
          </div>
        ))}
      </div>
      {tabs.map((tab, key) => (
        <div
          className={`tab-content ${
            openTab !== tab.index ? 'hidden' : 'block'
          }`}
          key={key}
        >
          {tab.content}
        </div>
      ))}
    </div>
  );
};

type VerticalTabsProps = {
  readonly tabs: readonly {
    readonly index: number;
    readonly content?: React.ReactElement;
    readonly title?: any;
  }[];
};

export const VerticalTabs: React.FunctionComponent<VerticalTabsProps> = ({
  tabs,
}: VerticalTabsProps) => {
  const [openTab, setOpenTab] = useState(0);

  return (
    <div className="flex items-start justify-start tabs">
      <div className="flex-shrink-0">
        <div className="flex flex-wrap flex-col space-y-1">
          {tabs.map((tab, key) => (
            <button
              key={key}
              onClick={() => {
                setOpenTab(tab.index);
              }}
              className={`tab tab-pill ${
                openTab === tab.index ? 'tab-active' : ''
              }`}
              type="button"
            >
              {tab.title}
            </button>
          ))}
        </div>
      </div>

      <div className="ltr:ml-2 rtl:mr-2">
        {tabs.map((tab, key) => (
          <div
            className={`tab-content ${
              openTab !== tab.index ? 'hidden' : 'block'
            }`}
            key={key}
          >
            {tab.content}
          </div>
        ))}
      </div>
    </div>
  );
};

type PillsProps = {
  readonly tabs: readonly {
    readonly index: number;
    readonly content?: React.ReactElement;
    readonly title?: any;
  }[];
};

export const Pills: React.FunctionComponent<PillsProps> = ({
  tabs,
}: PillsProps) => {
  const [openTab, setOpenTab] = useState(0);

  return (
    <div className="flex flex-wrap flex-col w-full tabs">
      <div className="flex flex-wrap flex-row children-x-2">
        {tabs.map((tab, key) => (
          <div key={key} className="flex-none">
            <button
              onClick={() => {
                setOpenTab(tab.index);
              }}
              className={`tab tab-pill ${
                openTab === tab.index ? 'tab-active' : ''
              }`}
              type="button"
            >
              {tab.title}
            </button>
          </div>
        ))}
      </div>
      {tabs.map((tab, key) => (
        <div
          className={`tab-content ${
            openTab !== tab.index ? 'hidden' : 'block'
          }`}
          key={key}
        >
          {tab.content}
        </div>
      ))}
    </div>
  );
};

type IconTabsProps = {
  readonly tabs: readonly {
    readonly index: number;
    readonly content?: React.ReactElement;
    readonly title?: any;
  }[];
};

export const IconTabs: React.FunctionComponent<IconTabsProps> = ({
  tabs,
}: IconTabsProps) => {
  const [openTab, setOpenTab] = useState(0);

  return (
    <div className="flex flex-wrap flex-col w-full tabs">
      <div className="flex flex-wrap flex-row children-x-2">
        {tabs.map((tab, key) => (
          <div key={key} className="flex-none">
            <button
              onClick={() => {
                setOpenTab(tab.index);
              }}
              className={`tab rounded-lg flex flex-row items-center justify-around ${
                openTab === tab.index ? 'tab-active' : ''
              }`}
              type="button"
            >
              {tab.title}
            </button>
          </div>
        ))}
      </div>
      {tabs.map((tab, key) => (
        <div
          className={`tab-content ${
            openTab !== tab.index ? 'hidden' : 'block'
          }`}
          key={key}
        >
          {tab.content}
        </div>
      ))}
    </div>
  );
};

export const UnderlinedTabs: React.FunctionComponent<any> = (props) => {
  const [openTab, setOpenTab] = useState(0);

  return (
    <div
      className={`
        flex flex-wrap flex-col w-full tabs
        ${typeof props.className !== 'undefined' ? props.className : ''}
      `}
    >
      <div className="flex flex-nowrap flex-row children-x-2">
        {props.tabs.map((tab, key) => (
          <div key={key} className="flex-none">
            <button
              onClick={() => {
                setOpenTab(tab.index);
              }}
              className={
                openTab === tab.index
                  ? 'tab tab-underline p-1 tab-active'
                  : 'tab tab-underline p-1'
              }
              type="button"
            >
              {tab.title}
            </button>
          </div>
        ))}
      </div>
      {props.tabs.map((tab, key) => (
        <div
          key={key}
          className={`
            tab-content
            ${openTab !== tab.index ? 'hidden' : 'block'}
            ${props.noContentPadding ? 'no-content-padding' : ''}
          `}
        >
          {tab.content}
        </div>
      ))}
    </div>
  );
};

export const BoxTabs: React.FunctionComponent<any> = (props) => {
  const [openTab, setOpenTab] = useState(0);

  return (
    <div className="flex flex-wrap flex-col w-full tabs">
      <div className="flex flex-nowrap flex-row">
        {props.tabs.map((tab, key) => (
          <div
            key={key}
            className={`flex justify-center ${props.fixTabWidth ? '' : 'w-full'}`}
            style={
              openTab === tab.index
              ? {
                borderLeft: '1px solid rgb(204, 204, 204)',
                borderRight: '1px solid rgb(204, 204, 204)',
                borderTop: '1px solid rgb(204, 204, 204)',
              }
              : {
                borderBottom: '1px solid rgb(204, 204, 204)',
              }
            }
          >
            <button
              onClick={() => {
                setOpenTab(tab.index);
                if(typeof props.onChange !== 'undefined') props.onChange(tab.index);
              }}
              className={`tab ${props.fixTabWidth ? 'py-3 px-6' : 'p-3 w-full'}`}
              type="button"
            >
              {tab.title}
            </button>
          </div>
        ))}
        <div
          className={`${props.fixTabWidth ? 'w-full' : ''}`}
          style={{
            borderBottom: '1px solid rgb(204, 204, 204)'
          }}
        ></div>
      </div>
      {props.tabs.map((tab, key) => (
        <div
          key={key}
          className={`
            tab-content
            ${openTab !== tab.index ? 'hidden' : 'block'}
            ${props.noContentPadding ? 'no-content-padding' : ''}
          `}
          style={{
            borderLeft: '1px solid rgb(204, 204, 204)',
            borderRight: '1px solid rgb(204, 204, 204)',
            borderBottom: '1px solid rgb(204, 204, 204)',
          }}
        >
          {tab.content}
        </div>
      ))}
    </div>
  );
};

export const VerticalBoxTabs: React.FunctionComponent<any> = (props) => {
  const tabs = props.tabs;
  const openTab = props.value;

  return (
    <div className="flex tabs tabs-vertical-box">
      <div style={{
        backgroundColor: '#E7E7F3'
      }}>
        <div className="flex flex-wrap flex-col">
          {tabs.map((tab, key) => (
            <button
              key={key}
              onClick={() => {
                props.onChange(tab.index);
              }}
              className={`tab tab-vertical-box px-4 py-3 ${
                openTab === tab.index ? 'tab-active' : ''
              }`}
              type="button"
            >
              {tab.title}
            </button>
          ))}
        </div>
      </div>

      <div>
        {tabs.map((tab, key) => (
          <div
            className={`tab-content ${
              openTab !== tab.index ? 'hidden' : 'block'
            }`}
            key={key}
          >
            {tab.content}
          </div>
        ))}
      </div>
    </div>
  );
};
