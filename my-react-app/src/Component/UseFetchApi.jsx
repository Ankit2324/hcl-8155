import { useEffect,useState } from "react";

function UseFetchApi() {
    const [products, setProducts] = useState([]);

    useEffect(()=>{

        async function getData(){
            try{
               const serverData = await fetch('https://fakestoreapi.com/products')
               const jsonData = await serverData.json();
               setProducts(jsonData);
            }catch(err){
                console.error('Error fetching data:', err);
            }
        }
    getData()
},[])


return (
    <div>
        <h2>Products: </h2>
        <div>{JSON.stringify(products)}</div>
    </div>
)
}
export default UseFetchApi