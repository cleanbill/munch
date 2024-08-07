"use client"
import { useLocalStorage } from "usehooks-ts";
import { useEffect, useState } from "react";
import { VERSIONS_STAMP, API_KEY } from "../../types";
import { ToastContainer, ToastPosition, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type Props = {
    overwriteData: Function;
    data: any;
}

const toastErrorOptions = {
    position: "top-center" as ToastPosition,
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light"
};

const URL = 'local-sync/';

const Sync = (props: Props) => {

    const [mounted, setMounted] = useState(false);
    const [versionstamp, setVersionstamp] = useLocalStorage(VERSIONS_STAMP, 0);
    const [token, setToken] = useLocalStorage(API_KEY, "munch");

    let blocked = false;

    useEffect(() => {
        setMounted(true);
    }, []);

    const getData = async () => {
        const requestOptions = {
            method: "GET",
            headers: { "Content-Type": "application/json", "X-API-KEY": token },
        };
        const response = await fetch(URL, requestOptions);
        if (response.status != 200) {
            toast.error('Failed to Sync data', toastErrorOptions);
            return;
        }
        try {
            const data = await response.json();
            return data;
        } catch (err) {
            console.error('Cannot parse data', err);
            toast("Sync failed - parsing problem");
        }
    }

    const load = async () => {
        if (blocked) {
            console.warn('Re-click load - blocked');
        }
        block();
        const data = await getData();
        if (!data) {
            toast.error('Sync has no data?', toastErrorOptions);
            return;
        }
        setVersionstamp(data.versionstamp);
        props.overwriteData(data);
        toast.info("Sync'd up!");
        release();
    }

    const checkVersion = async () => {
        if (versionstamp == 0) {
            return;
        }
        const data = await getData();
        if (data.versionstamp != versionstamp) {
            toast.error('Cannot Send - out of sync', toastErrorOptions);
            throw Error("Out of sync");
        }
    }

    const save = async () => {
        if (blocked) {
            console.warn('Re-click save - blocked');
        }
        block();
        checkVersion();
        const data = {
            token,
            data: props.data
        };

        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json", "X-API-KEY": token },
            body: JSON.stringify(data),
        };
        const response = await fetch(URL, requestOptions);
        try {
            const backData = await response.json();
            const vs = backData.versionstamp;
            setVersionstamp(vs);
            toast.info("Sync sent and saved");
            console.log(backData)
        } catch (er) {
            console.error(er);
            console.error(response);
        }
        release();
    }

    const hasToken = token != 'munch';
    const noToken = !hasToken;

    const updateToken = () => {
        const el = document.getElementById("token-input") as HTMLInputElement;
        setToken(el.value);
    }

    const clearToken = () => {
        setToken("munch");
    }

    const block = () => {
        (document.getElementById("load-butt") as HTMLButtonElement).disabled = true;
        (document.getElementById("save-butt") as HTMLButtonElement).disabled = true;
        (document.getElementById("clear-butt") as HTMLButtonElement).disabled = true;
        blocked = true;
    }

    const release = () => {
        (document.getElementById("load-butt") as HTMLButtonElement).disabled = false;
        (document.getElementById("save-butt") as HTMLButtonElement).disabled = false;
        (document.getElementById("clear-butt") as HTMLButtonElement).disabled = false;
        blocked = false;
    }

    return (
        <div >
            {mounted && noToken && <div>
                <input id="token-input" className="w-4/5 bg-sky-200 text-left" placeholder="Whats the token"></input><button className="float-right w-10 text-red-500 bg-yellow-100 hover:bg-blue-200 focus:outline-none focus:ring hover:pr-0 focus:ring-yellow-300 text-xs rounded-xl h-5" onClick={updateToken}>post</button>
            </div>}

            {mounted && hasToken && <div>
                < ToastContainer />
                <div className='grid grid-cols-3'>
                    <button id="load-butt" className="w-10 text-red-500 hover:bg-blue-200 focus:outline-none focus:ring hover:pr-0 focus:ring-yellow-300 text-xs rounded-xl h-5 float-start" onClick={load} >Sync</button>
                    <button id="clear-butt" className="w-10 text-red-500 hover:bg-blue-200 focus:outline-none focus:ring hover:pr-0 focus:ring-yellow-300 text-xs rounded-xl h-5 place-self-center" onClick={clearToken} >clear</button>
                    <button id="save-butt" className="w-10 text-green-500 hover:bg-blue-200 focus:outline-none focus:ring hover:pr-0 focus:ring-yellow-300 text-xs rounded-xl h-5 place-self-end" onClick={save} >Send</button>
                </div>
            </div>}
        </div >
    )
}

export default Sync