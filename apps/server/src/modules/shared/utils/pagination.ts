export function buildPagination(query:any){

    const page =
    Number(query.page)||1;
   
    const limit =
    Number(query.limit)||20;
   
    return {
      page,
      limit,
      skip:(page-1)*limit
    };
   }