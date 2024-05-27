import React from "react";
import { Card, CardBody, Image } from "@nextui-org/react";
import classes from "./Card.module.css";

interface Props {
  imageSource: string;
  userDeposit: number;
  totalDeposited: number;
  apr: number;
  title: string;
  onPress: () => void;
}

const CardItem = ({
  imageSource,
  totalDeposited,
  apr,
  userDeposit,
  title,
  onPress,
}: Props) => {
  return (
    <Card
      isBlurred
      className={`border-none bg-background/60 dark:bg-default-100/50 max-w-[810px] ${classes.wrapper}`}
      shadow="sm"
      style={{ backgroundColor: "#2E334B" }}
    >
      <CardBody>
        <div
          onClick={onPress}
          className="flex flex-col sm:flex-row flex-1 cursor-pointer"
        >
          {!!imageSource && (
            <div className="flex-[1]">
              <Image
                alt="Album cover"
                className={classes.image}
                height="100%"
                src={imageSource}
                width="100%"
                isZoomed
              />
            </div>
          )}
          <div className="flex flex-[2] flex-col justify-between pl-3">
            <div className={classes.title}>{title}</div>
            <div>
              This Vault Employs Dynamic Strategies To Optimize Real Yield
              Stable-Coin Based Earnings
            </div>

            <div>
              <div className={classes.property}>My Deposit</div>
              <div className={classes.value}>{userDeposit} USDC</div>
            </div>

            <div className="flex gap-5">
              <div>
                <div className={classes.property}>Deposited</div>
                <div className={classes.value}>{totalDeposited} USDC</div>
              </div>
              <div>
                <div className={classes.property}>APR</div>
                <div className={classes.value}>{apr} %</div>
              </div>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default CardItem;
