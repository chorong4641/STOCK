import React from "react";
import { Table } from "antd";
import styled from "styled-components";

const TableStyled = styled.div`
  .ant-table-thead {
    th {
      text-align: center !important;
    }
  }

  .ant-table-tbody {
    a:hover {
      font-weight: bold;
    }
  }
`;

function CommonTable({ columns, data, size = "small", ...rest }) {
  return (
    <TableStyled>
      <Table dataSource={data} columns={columns} size={size} {...rest} />
    </TableStyled>
  );
}

export default CommonTable;
