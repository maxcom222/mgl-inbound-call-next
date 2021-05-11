import React from 'react';

export const PageWithText: React.FunctionComponent<any> = ({
  children,
  active = false,
  onClick,
}: any) => {
  if (active)
    return (
      <button
        className="btn btn-sm btn-indigo"
        style={{padding: '0.31rem', marginRight: 4}}
        disabled={true}
      >
        {children}
      </button>
    );

  return (
    <button
      onClick={onClick}
      className="btn btn-sm btn-indigo"
      style={{padding: '0.31rem', marginRight: 4}}
    >
      {children}
    </button>
  );
};

export const Active: React.FunctionComponent<any> = ({
  color,
  page,
  onClick,
}: any) => (
  <button onClick={onClick} className={`btn btn-circle btn-${color}`}>
    {page}
  </button>
);

export const Inactive: React.FunctionComponent<any> = ({
  page,
  onClick,
}: any) => (
  <button onClick={onClick} className="btn btn-circle btn-default-color">
    {page}
  </button>
);

export const Page: React.FunctionComponent<any> = ({
  color,
  page,
  active = false,
  onClick,
}: any) => {
  if (active) return <Active onClick={onClick} page={page} color={color} />;

  return <Inactive onClick={onClick} page={page} color={color} />;
};

type PaginationProps = {
  readonly color: string;
  readonly items: readonly any[];
  readonly active: number;
  readonly onClick: () => void;
};

export const Pagination: React.FunctionComponent<PaginationProps> = ({
  color,
  items,
  onClick,
}: PaginationProps) => (
  <>
    {items.map((i: number) => (
      <Page
        onClick={onClick}
        color={color}
        page={i + 1}
        active={i + 1 === 5 ? true : false}
        key={i}
      />
    ))}
  </>
);

type PaginationWithTextProps = {
  readonly color: string;
  readonly items: readonly any[];
  readonly active: number;
};

export const PaginationWithText: React.FunctionComponent<PaginationWithTextProps> = ({
  color = 'text-default',
  items,
  active,
}: PaginationWithTextProps) => (
  <div className="flex flex-wrap items-center justify-start children-x-2 pagination">
    <PageWithText onClick={() => null} color={color}>
      Previous
    </PageWithText>

    <Pagination
      onClick={() => null}
      color={color}
      items={items}
      active={active}
    />

    <PageWithText onClick={() => null} color={color}>
      Next
    </PageWithText>
  </div>
);
