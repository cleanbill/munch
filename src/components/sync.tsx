"use client"
import { useLocalStorage } from "usehooks-ts";
import { useEffect, useState } from "react";
import { Eater, MUNCH, Dinner, SELECTED_MEAL, MealPlan, SELECTED_DATE_INDEX, MUNCH_BAK, VERSIONS_STAMP, API_KEY } from "../../types";
import DinnerForm from "./dinnerForm";


const Sync = () => {

    const [mounted, setMounted] = useState(false);
    const [dinners, setDinners] = useLocalStorage(MUNCH, new Array<Dinner>());
    const [_back, setBack] = useLocalStorage(MUNCH_BAK, new Array<Dinner>());
    const [versionstamp, setVersionstamp] = useLocalStorage(VERSIONS_STAMP, 0);
    const [token, _setToken] = useLocalStorage(API_KEY, "munch");

    useEffect(() => {
        setMounted(true);
    }, []);

    const getData = async () => {
        const URL = 'sync/' + token;
        const requestOptions = {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        };
        const response = await fetch(URL, requestOptions);
        const data = await response.json();

        return data;
    }

    const load = async () => {

        const data = await getData();

        // Back it up...
        setBack([...dinners]);
        setVersionstamp(data.versionstamp);
        setDinners([...data.value.dinners]);
    }

    const checkVersion = async () => {
        if (versionstamp == 0) {
            return;
        }
        const data = await getData();
        if (data.versionstamp != versionstamp) {
            throw Error("Out of sync");
        }
    }

    const save = async () => {
        checkVersion();
        const URL = 'sync';
        const data = {
            token,
            dinners,
        };

        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        };
        await fetch(URL, requestOptions);
    }

    return (
        <div >
            {mounted && <div className='grid grid-cols-2'>
                <button className="w-10 text-red-500 hover:bg-blue-200 focus:outline-none focus:ring hover:pr-0 focus:ring-yellow-300 text-xs rounded-xl h-5 float-start" onClick={load} >Sync</button>
                <button className="w-10 text-green-500 hover:bg-blue-200 focus:outline-none focus:ring hover:pr-0 focus:ring-yellow-300 text-xs rounded-xl h-5 place-self-end" onClick={save} >Send</button>
            </div>}
        </div>
    )
}

export default Sync