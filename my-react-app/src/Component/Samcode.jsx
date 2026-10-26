import { useEffect, useState } from "react";

function Samcode() {

    const [pointer,setPointer]=useState(0)

    function ChangePointer(){
        setPointer(pointer+2);
    }
  return (
    <div>
     <button onClick={ChangePointer}>Pointer: </button>
     <div>{pointer}</div>
    </div>
  );
}

export default Samcode;