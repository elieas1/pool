import { Card, CardBody, Tooltip } from "@nextui-org/react";
import React from "react";
import classes from "./Deposits.module.css";

type Props = {
  approved: number;
  pending: number;
};

const Deposits = ({ approved, pending }: Props) => {
  return (
    <Card style={{ backgroundColor: "#2E334B" }} isBlurred>
      <CardBody>
        <div style={{ color: "white" }} className="flex justify-between p-5">
          <div className="flex gap-2">
            Pending Deposit
            <Tooltip content="Pending amount requires admin approval before being included in the deposited pool">
              <div className={classes.tooltip}>?</div>
            </Tooltip>
          </div>
          <div>{pending} USDC</div>
        </div>

        <div style={{ color: "white" }} className="flex justify-between p-5">
          <div>Approved Deposit</div>
          <div>{approved} USDC</div>
        </div>
      </CardBody>
    </Card>
  );
};

export default Deposits;
