"use client";
import Image from "next/image";
import iconLike from "../../../../public/images/icons/icon-like.svg";
import iconLikeTrue from "../../../../public/images/icons/icon-like-true.svg";
import { useEffect, useState } from "react";
import Detail from "./Detail";
import Reply from "./Reply";
import { fetchDetail } from "./page";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import Buying from "./Buying";
import AddCart from "./AddCart";
import { useProductStore } from "@/zustand/Store";
import plus from "../../../../public/images/icons/plus.svg";
import minus from "../../../../public/images/icons/minus.svg";
import DegreeBar from "@/components/DegreeBar";
export default function DetailClient() {
  let content;
  let { id } = useParams();

  const { data } = useQuery({
    queryKey: ["detail", id],
    queryFn: () => fetchDetail(id as string),
  });

  const { showDetail, setShowDetail, setName, setPrice, quantity, setQuantity, setBrewery } =
    useProductStore((state) => ({
      showDetail: state.showDetail,
      setShowDetail: state.setShowDetail,
      setName: state.setName,
      setPrice: state.setPrice,
      quantity: state.quantity,
      setQuantity: state.setQuantity,
      setBrewery: state.setBrewery,
    }));

  if (data) {
    if (showDetail) {
      content = <Detail data={data} />;
    } else {
      content = <Reply data={data} />;
    }
  }

  const add = () => {
    if (quantity > 99) {
      alert("상품은 100개 이상 구입할 수 없습니다.");
    } else {
      setQuantity(quantity + 1);
    }
  };
  const remove = () => {
    if (quantity < 2) {
      alert("0개 이하는 구매할 수 없습니다.");
    } else {
      setQuantity(quantity - 1);
    }
  };

  useEffect(() => {
    if (data) {
      setName(data?.name);
      setPrice(data?.price);
      setBrewery(data?.extra?.brewery);
    }
  }, [data, setName, setPrice, setBrewery]);
  console.log(data);

  return (
    <>
      {data && (
        <div className="justify-center max-w-3xl ">
          <Image
            src={`https://api.fesp.shop${data?.mainImages[0]?.path}`}
            width={428}
            height={450}
            alt="술 이미지"
          />
        </div>
      )}
      <div className="relative  py-8 mt-[-35px]  max-w-[428px] bg-white topRound topShadow shadow-2xl">
        <div className="flex flex-col justify-between px-10">
          <p className="content text-darkGray text-ellipsis ">{data?.extra.brewery}</p>
          <h1 className="flex items-center titleMedium">{data?.name}</h1>
          <p className="mt-1 contentMedium text-ellipsis">{data?.price.toLocaleString()}원</p>
        </div>

        <div className="flex flex-row justify-between px-10 mt-2">
          <div className="w-[105px] h-[64px] flex flex-col items-center justify-center bg-ivory round gap-1 ">
            <span className="text-black contentMedium">주종</span>
            <p className="description text-gray ">{data?.extra.category}</p>
          </div>

          <div className="w-[105px] h-[64px] flex flex-col items-center justify-center bg-ivory round gap-1">
            <span className="text-black contentMedium ">도수</span>
            <p className="description text-gray">{data?.extra.taste.alcohol}도</p>
          </div>
          <div className="w-[105px] h-[64px] flex flex-col items-center justify-center bg-ivory round ">
            <span className="text-black contentMedium">용량</span>
            <p className="description text-gray">{data?.extra.volume}ml</p>
          </div>
        </div>
        <div className="p-3 px-10 mt-4">
          <p className="contentMedium t">테이스팅 그래프</p>
          <div className="px-10 py-6 mt-5 border-2 border-lightGray round bg-[#fbfbfb]">
            <table className="w-full text-darkGray">
              <tbody className="">
                <tr className="mt-10">
                  <td width="30%">당도</td>
                  <td height="34px">
                    <DegreeBar degree={data?.extra.taste.sweet} color="#FF8F4B" />
                  </td>
                </tr>
                <tr className="mt-10">
                  <td width="30%">산미</td>
                  <td height="34px" className="mt-1">
                    <DegreeBar degree={data?.extra.taste.acidity} color="#FF8F4B" />
                  </td>
                </tr>
                <tr>
                  <td width="30%">바디감</td>
                  <td height="34px">
                    <DegreeBar degree={data?.extra.taste.body} color="#FF8F4B" />
                  </td>
                </tr>
                <tr>
                  <td width="30%">씁쓸함</td>
                  <td height="34px">
                    <DegreeBar degree={data?.extra.taste.bitter} color="#FF8F4B" />
                  </td>
                </tr>
                <tr>
                  <td width="30%">탄산</td>
                  <td height="34px">
                    <DegreeBar degree={data?.extra.taste.sparkle} color="#FF8F4B" />
                  </td>
                </tr>
                <tr>
                  <td width="30%">소비기한</td>
                  <td height="34px">{data?.extra.useByDate}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="flex flex-row px-10 mt-5 round top-shadow ">
          <button
            className={`contentMedium w-full  h-[52px] flex items-center justify-center cursor-pointer  transition-colors round ${
              showDetail ? "bg-primary text-white " : "bg-whiteGray text-black"
            }`}
            onClick={() => setShowDetail(true)}
          >
            상세설명
          </button>
          <button
            className={`contentMedium w-full  h-[52px] flex items-center  justify-center cursor-pointer transition-colors round ${
              !showDetail ? "bg-primary text-white" : "bg-whiteGray text-black"
            }`}
            onClick={() => setShowDetail(false)}
          >
            후기
          </button>
        </div>

        <div>{content}</div>
        <div className="sticky flex flex-row gap-3 px-10 mt-5 left-6 round bottom-[1px] bottomShadow">
          <AddCart data={data} />
          <Buying data={data} />
        </div>
      </div>
    </>
  );
}
