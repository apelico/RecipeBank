import { useState,useEffect } from "react"

function getSavedValue(key:string, initialValue: any){
    const storedText = sessionStorage.getItem(key);

    if(storedText !== null && storedText !== '' && storedText !== 'undefined'){
        const savedValue:string = JSON.parse(storedText);

        if(savedValue) return savedValue
    }

    return initialValue
}

export default function useSessionStorage(key:string, initialValue: string) {
    const [value,setValue] = useState(() => {
        return getSavedValue(key, initialValue)
    });

    useEffect(() => {
        sessionStorage.setItem(key,JSON.stringify(value))
    }, [value])

    return [value,setValue]
}
