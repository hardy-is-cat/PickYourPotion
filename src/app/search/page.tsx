"use client";
import Image from "next/image";
import searchIcon from "../../../public/images/icons/icon-search.svg";
import Input from "@/components/Input";
import { useEffect, useState } from "react";
import CardItemSmall from "../CardItemSmall";
import useDebounce from "./useDebounce";
import { fetchSearch } from "./fetchSearch";
import Pagination from "@/components/Pagination";

async function fetchAllData(page = 1, limit = 5) {
  const API_SERVER = process.env.NEXT_PUBLIC_API_SERVER;
  const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID;
  const url = `${API_SERVER}/products/?page=${page}&limit=${limit}`;
  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      "client-id": `${CLIENT_ID}`,
    },
  });
  const resJson = await res.json();
  if (!resJson.ok) {
    throw new Error("error");
  }
  return resJson;
}

export default function Page() {
  const [searchText, setSearchText] = useState("");
  const [fetchedResult, setFetchedResult] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const debounceValue = useDebounce(searchText, 1000);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let result;
        if (searchText === "") {
          result = await fetchAllData(currentPage);
        } else {
          result = await fetchSearch(debounceValue);
        }
        setFetchedResult(result);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [debounceValue, currentPage]);

  const handlePageChange = (selectedPage: number) => {
    setCurrentPage(selectedPage);
  };

  const list = fetchedResult?.item?.map((data: any) => (
    <CardItemSmall key={data._id} data={data} />
  ));

  return (
    <div className="flex flex-col mx-[25px] mt-14">
      <div className="text-[36px] text-darkGray mb-10">
        <p>
          <span className="font-medium text-primary">어떤 술</span>을
        </p>
        <p>원하시나요?</p>
      </div>
      <div className="relative">
        <Input
          type={""}
          id={""}
          placeholder="검색어를 입력해주세요."
          onChange={(e) => setSearchText(e.target.value)}
        />
        <button className="absolute transform -translate-y-1/2 right-1 top-1/2">
          <Image src={searchIcon} width={35} height={35} alt="돋보기 버튼" />
        </button>
      </div>
      <div className="my-8">{list?.length > 0 && list}</div>
      <div className="mb-5">
        <Pagination
          pageCount={Math.ceil(fetchedResult?.pagination.totalPages)}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}
