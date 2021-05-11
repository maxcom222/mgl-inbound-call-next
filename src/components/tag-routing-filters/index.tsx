import React, { useState } from 'react';
import {useQuery} from '@apollo/client';
import * as Icon from 'react-feather';
import ClickOutside from 'react-click-outside';
import groupBy from 'json-groupby';

import { TextInput } from 'components/forms/text-inputs';
import { ReactSelect } from 'components/forms/selects';
import {VerticalBoxTabs} from 'components/tabs';
import statesData from 'json/states.json';
import {VIEW_OWNERS} from 'shared/queries/owners';
import {VIEW_TAGS} from 'shared/queries/tags';
import {VIEW_NUMBERS} from 'shared/queries/numbers';
import {VIEW_AFFILIATES} from 'shared/queries/publishers';
import {VIEW_TARGETS} from 'shared/queries/targets';
import TagCollapses from './tag-collapses';

const adaptTags = (tags):any => {
  const tagsGrouped = groupBy(tags, ['type']);

  return Object.keys(tagsGrouped).map((key) => ({
    label: key,
    items: tagsGrouped[key].map((el) => ({
      label: el.name,
      value: el.id
    }))
  }));
}

const states = statesData.map((el) => ({
  label: el.name,
  value: el.abbreviation
}));

const Index: React.FunctionComponent<any> = (props) => {
  const initialCriteria = {
    data: {
      tagRoutableRule: {
        data: [
          {
            tagCriteria: {
              data: [
                {
                  tagId: null,
                  tagIds: ['InboundNumber:State'],
                  comparisonType: 'EQUALS',
                  value: '',
                  isNegativeMatch: false,
                  isNumber: false
                }
              ]
            }
          }
        ]
      }
    }
  }

  const {loading: loadingNumbers, data: numbersData} = useQuery(VIEW_NUMBERS);
  const {loading: loadingAffiliates, data: affiliatesData} = useQuery(VIEW_AFFILIATES);
  const {loading: loadingOwners, data: ownersData} = useQuery(VIEW_OWNERS);
  const {loading: loadingTargets, data: targetsData} = useQuery(VIEW_TARGETS);
  const {loading: loadingTags, data: tagsData} = useQuery(VIEW_TAGS);

  const criteria = props.value;

  const customInput = {
    dialedNumberName: null,
    dialedNumberNumber: null,
    inboundNumberState: null,
    publisherCompany: null,
    publisherId: null,
    publisherName: null,
    buyerId: null,
    buyerName: null,
    targetId: null,
    targetName: null,
    geoSubDivision: null,
    geoSubDivisionCode: null,
  };

  const setCriteria = (v, key, keyy):void => {
    const newCriteria = JSON.parse(JSON.stringify(criteria));
    newCriteria.data.tagRoutableRule.data[key].tagCriteria.data[keyy].value = v;
    props.onChange(newCriteria);
  }

  if(
    loadingNumbers ||
    loadingAffiliates ||
    loadingOwners ||
    loadingTargets ||
    loadingTags
  ) return <></>;

  const numbers = numbersData.numbers.map((el) => ({
    label: el.phoneNumber,
    value: el.id.toString()
  }));
  const publishers = affiliatesData.affiliates.map((el) => ({
    label: el.name,
    value: el.id.toString()
  }));
  const buyers = ownersData.buyers.map((el) => ({
    label: el.name,
    value: el.id.toString()
  }));
  const targets = targetsData.targets.map((el) => ({
    label: el.name,
    value: el.id.toString()
  }));
  const tags = tagsData.tags.map((el) => ({
    id: el.id.toString(),
    name: el.name,
    value: el.value,
    type: el.type,
    source: el.source
  }));

  tags.map((el) => {
    // source: Call
    if(el.type === 'DialedNumber' && el.name === 'Name'){
      customInput.dialedNumberName = el.id;
    }
    if(el.type === 'DialedNumber' && el.name === 'Number'){
      customInput.dialedNumberNumber = el.id;
    }
    if(el.type === 'InboundNumber' && el.name === 'State'){
      customInput.inboundNumberState = el.id;
    }
    if(el.type === 'Publisher' && el.name === 'Company'){
      customInput.publisherCompany = el.id;
    }
    if(el.type === 'Publisher' && el.name === 'Id'){
      customInput.publisherId = el.id;
    }
    if(el.type === 'Publisher' && el.name === 'Name'){
      customInput.publisherName = el.id;
    }

    // source: Connection
    if(el.type === 'Buyer' && el.name === 'Id'){
      customInput.buyerId = el.id;
    }
    if(el.type === 'Buyer' && el.name === 'Name'){
      customInput.buyerName = el.id;
    }
    if(el.type === 'Target' && el.name === 'Id'){
      customInput.targetId = el.id;
    }
    if(el.type === 'Target' && el.name === 'Name'){
      customInput.targetName = el.id;
    }

    // source: Jstag
    if(el.type === 'Geo' && el.name === 'SubDivision'){
      customInput.geoSubDivision = el.id;
    }
    if(el.type === 'Geo' && el.name === 'SubDivisionCode'){
      customInput.geoSubDivisionCode = el.id;
    }
  });

  return(
    <div>
      {criteria.data.tagRoutableRule.data.length === 0
        ? (
          <button
            className="btn btn-sm btn-indigo btn-icon"
            onClick={() => props.onChange(initialCriteria)}
          >
            <div className="flex items-center">
              <Icon.Plus size={14} className="mr-1" />
              ADD FILTER
            </div>
          </button>
        )
        : (
          criteria.data.tagRoutableRule.data.map((el, key) => (
            <div key={key}>
              <div className={`flex justify-center items-center w-full py-3 ${key > 0 ? '' : 'hidden'}`}>
                <span>And</span>
              </div>
              <div className="p-4 border border-black">
                <div className="mb-4">
                  {el.tagCriteria.data.map((tagCriteria, keyy) => (
                    <div key={keyy}>
                      <div className={`flex justify-center items-center w-full py-3 ${keyy > 0 ? '' : 'hidden'}`}>
                        <span>Or</span>
                      </div>
                      <div className="relative md:flex">
                        <div className="w-full md:w-5/12 md:pr-2">
                          <TagSelect
                            placeholder="Select Tag"
                            tags={tags}
                            value={tagCriteria.tagId}
                            onChange={(value) => {
                              const newCriteria = JSON.parse(JSON.stringify(criteria));
                              newCriteria.data.tagRoutableRule.data[key].tagCriteria.data[keyy].tagId = value;
                              newCriteria.data.tagRoutableRule.data[key].tagCriteria.data[keyy].value = '';
                              props.onChange(newCriteria);
                            }}
                          />
                        </div>
                        <div className="w-full md:w-2/12 md:pr-2">
                          <ReactSelect
                            placeholder="Select Operator"
                            value={tagCriteria.comparisonType}
                            options={[
                              {
                                label: 'Begins With',
                                value: 'BEGINS_WITH'
                              },
                              {
                                label: 'Contains',
                                value: 'CONTAINS'
                              },
                              {
                                label: 'Equals',
                                value: 'EQUALS'
                              },
                              {
                                label: 'Exists',
                                value: 'EXISTS'
                              },
                              {
                                label: 'Greater than',
                                value: 'GREATER_THAN'
                              },
                              {
                                label: 'Less than',
                                value: 'LESS_THAN'
                              },
                            ]}
                            onChange={(value) => {
                              const newCriteria = JSON.parse(JSON.stringify(criteria));
                              newCriteria.data.tagRoutableRule.data[key].tagCriteria.data[keyy].comparisonType = value;
                              props.onChange(newCriteria);
                            }}
                          />
                        </div>
                        <div className="w-full md:w-5/12 md:pr-8">
                          {
                            (() => {
                              if(
                                tagCriteria.tagId === customInput.dialedNumberName ||
                                tagCriteria.tagId === customInput.dialedNumberNumber
                              ){
                                return (
                                  <ReactSelect
                                    placeholder="Select Number"
                                    value={tagCriteria.value}
                                    options={numbers}
                                    onChange={(value) => setCriteria(value, key, keyy)}
                                  />
                                );
                              }
                              else if(
                                tagCriteria.tagId === customInput.publisherCompany ||
                                tagCriteria.tagId === customInput.publisherId ||
                                tagCriteria.tagId === customInput.publisherName
                              ){
                                return (
                                  <ReactSelect
                                    placeholder="Select Publisher"
                                    value={tagCriteria.value}
                                    options={publishers}
                                    onChange={(value) => setCriteria(value, key, keyy)}
                                  />
                                );
                              }
                              else if(
                                tagCriteria.tagId === customInput.buyerId ||
                                tagCriteria.tagId === customInput.buyerName
                              ){
                                return (
                                  <ReactSelect
                                    placeholder="Select Buyer"
                                    value={tagCriteria.value}
                                    options={buyers}
                                    onChange={(value) => setCriteria(value, key, keyy)}
                                  />
                                );
                              }
                              else if(
                                tagCriteria.tagId === customInput.targetId ||
                                tagCriteria.tagId === customInput.targetName
                              ){
                                return (
                                  <ReactSelect
                                    placeholder="Select Target"
                                    value={tagCriteria.value}
                                    options={targets}
                                    onChange={(value) => setCriteria(value, key, keyy)}
                                  />
                                );
                              }
                              else if(
                                tagCriteria.tagId === customInput.inboundNumberState ||
                                tagCriteria.tagId === customInput.geoSubDivision ||
                                tagCriteria.tagId === customInput.geoSubDivisionCode
                              ){
                                return (
                                  <ReactSelect
                                    placeholder="Select States"
                                    value={tagCriteria.value !== '' ? JSON.parse(tagCriteria.value) : []}
                                    options={states}
                                    onChange={(value) => setCriteria(JSON.stringify(value), key, keyy)}
                                    isMulti
                                  />
                                );
                              }
                              else{
                                return (
                                  <TextInput
                                    placeholder="Value"
                                    value={tagCriteria.value}
                                    onChange={(value) => setCriteria(value, key, keyy)}
                                  />
                                );
                              }
                            })()
                          }
                        </div>
                        <div
                          className="absolute inset-y-0 right-0 flex items-center"
                        >
                          <button
                            className="btn-xs"
                            onClick={() => {
                              const newCriteria = JSON.parse(JSON.stringify(criteria));
                              newCriteria.data.tagRoutableRule.data[key].tagCriteria.data.splice(keyy, 1);
                              if(newCriteria.data.tagRoutableRule.data[key].tagCriteria.data.length === 0){
                                newCriteria.data.tagRoutableRule.data.splice(key, 1);
                              }
                              props.onChange(newCriteria);
                            }}
                          >
                            <Icon.X size={14} className="mr-1" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="relative flex">
                  <button
                    className="btn btn-sm btn-indigo mr-2"
                    onClick={() => {
                      const newCriteria = JSON.parse(JSON.stringify(criteria));
                      newCriteria.data.tagRoutableRule.data[key].tagCriteria.data.push(
                        initialCriteria.data.tagRoutableRule.data[0].tagCriteria.data[0]
                      );
                      props.onChange(newCriteria);
                    }}
                  >
                    ADD OR RULE
                  </button>
                  <button
                    className="btn btn-sm btn-indigo mr-2"
                    onClick={() => {
                      const newCriteria = JSON.parse(JSON.stringify(criteria));
                      newCriteria.data.tagRoutableRule.data.push(initialCriteria.data.tagRoutableRule.data[0]);
                      props.onChange(newCriteria);
                    }}
                  >
                    ADD AND RULE
                  </button>
                </div>
              </div>
            </div>
          ))
        )
      }
    </div>
  );
}

const TagSelect: React.FunctionComponent<any> = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFocus, setIsFocus] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);
  const [keyword, setKeyword] = useState('');
  const [searchResult, setSearchResult] = useState([]);

  const tag = props.tags[props.tags.findIndex((el) => el.id === props.value)];
  let text = '';

  if(typeof tag !== 'undefined'){
    text = `${tag.source} - ${tag.type} - ${tag.name}`;
  }

  const handleChange = (v):void => {
    props.onChange(v);
    setIsOpen(false);
    setKeyword('');
    setSearchResult([]);
  }
  const search = (k):void => {
    if(k !== ''){
      setSearchResult(props.tags.filter((el) =>
        el.name.toLowerCase().includes(k.toLowerCase()) ||
        el.type.toLowerCase().includes(k.toLowerCase()) ||
        el.source.toLowerCase().includes(k.toLowerCase())
      ));
    }else{
      setSearchResult([]);
    }
  }

  return (
    <ClickOutside onClickOutside={() => {
      setIsOpen(false);
      setIsFocus(false);
      setKeyword('');
      setSearchResult([]);
    }}>
      <div
        className={`
          common-select-dropdown-wrapper
          ${isFocus ? 'focus' : ''}
          ${typeof props.className !== 'undefined' ? props.className : ''}
          ${typeof props.size !== 'undefined' ? `size-${props.size}` : ''}
        `}
      >
        <div className="common-select-dropdown-control flex justify-between text-sm block border w-full"
          onClick={() => {
            setIsOpen(true);
            setIsFocus(true);
            setTabIndex(0);
          }}
        >
          <input
            className="common-select-dropdown-text w-full outline-none active"
            placeholder="Select Tag"
            value={isOpen ? keyword : text}
            onChange={(e) => {
              setKeyword(e.target.value);
              search(e.target.value);
            }}
          />
          <div className="common-select-dropdown-indicator-wrapper">
            <svg
              height="20"
              width="20"
              viewBox="0 0 20 20"
              aria-hidden="true"
              focusable="false"
            >
              <path
                d="
                  M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481
                  1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695
                  4.502-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0
                  0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z
                "
              ></path>
            </svg>
          </div>
        </div>
        {isOpen &&
          <div className="common-select-dropdown" style={{
            padding: 0,
            maxHeight: 'unset'
          }}>
            <VerticalBoxTabs
              value={tabIndex}
              onChange={(i) => setTabIndex(i)}
              tabs={[
                {
                  index: 0,
                  title: 'Search',
                  content:
                    <SearchTab
                      tags={searchResult}
                      onChange={(value) => handleChange(value)}
                    />
                },
                {
                  index: 1,
                  title: 'Call',
                  content:
                    <CallTab
                      tags={props.tags.filter((el) => el.source === 'Call')}
                      onChange={(value) => handleChange(value)}
                    />
                },
                {
                  index: 2,
                  title: 'Connection',
                  content:
                    <ConnectionTab
                      tags={props.tags.filter((el) => el.source === 'Connection')}
                      onChange={(value) => handleChange(value)}
                    />
                },
                {
                  index: 3,
                  title: 'Jstag',
                  content:
                    <JstagTab
                      tags={props.tags.filter((el) => el.source === 'JSTag')}
                      onChange={(value) => handleChange(value)}
                    />
                },
                // { index: 4, title: 'Zipcode', content: <ZipcodeTab /> }
              ]}
            />
          </div>
        }
      </div>
    </ClickOutside>
  );
};

const SearchTab: React.FunctionComponent<any> = (props) => (
    <div>
      {
        props.tags.length > 0
        ? (
          <TagCollapses
            options={adaptTags(props.tags)}
            onChange={(value) => props.onChange(value)}
          />
          )
          : (
            <p className="text-gray-600 pb-2 text-xs">Recently Used</p>
          )
      }
    </div>
  )

const CallTab: React.FunctionComponent<any> = (props) => (
    <div>
      <TagCollapses
        options={adaptTags(props.tags)}
        onChange={(value) => props.onChange(value)}
      />
    </div>
  )

const ConnectionTab: React.FunctionComponent<any> = (props) => (
    <div>
      <TagCollapses
        options={adaptTags(props.tags)}
        onChange={(value) => props.onChange(value)}
      />
    </div>
  )

const JstagTab: React.FunctionComponent<any> = (props) => (
    <div>
      <TagCollapses
        options={adaptTags(props.tags)}
        onChange={(value) => props.onChange(value)}
      />
    </div>
  )

// const ZipcodeTab: React.FunctionComponent<any> = (props) => (
//   <p>e</p>
// )

export default Index;