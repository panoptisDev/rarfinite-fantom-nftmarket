import { useEffect, useState } from "react";
import { ethers, Wallet } from "ethers";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import axios from "axios";
import * as PushAPI from "@pushprotocol/restapi";
import { Polybase } from "@polybase/client";
import { ethPersonalSign } from "@polybase/eth";
import { useRouter } from "next/router";

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer'

import "@/styles/globals.css";
import "@/styles/tailwind.css";
import "@/styles/custom.css";

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const wallet = new Wallet(process.env.NEXT_PUBLIC_ACCOUNT_PRIVATE_KEY);

  const storage = new ThirdwebStorage();
  //SIGNER INFORMATION
  const [signer, setSigner] = useState();
  const [provider, set_provider] = useState();
  const [chainIdMain, setChainIdMain] = useState();
  const [signer_address, set_signer_address] = useState("");
  const [signer_bal, set_signer_bal] = useState(0);
  const [format_signer_bal, set_format_signer_bal] = useState(0);
  const [nfts, set_nfts] = useState([]);
  const [search_data] = useState(nfts);
  const [chainId, set_current_chainId] = useState();
  console.log({ chainIdMain, chainId });

  //COLLECTIONS INFORMATION
  const [all_collections, set_collections] = useState([]);

  // push channel address
  const Rarfinite_CHANNEL_ADDRESS = "0x7671A05D4e947A7E991a8e2A92EEd7A3a9b9A861";

  // connect wallet metamask
  const connectToWallet = async () => {
    // const db = polybase();
    if (window?.ethereum) {
      const provider = new ethers.providers.Web3Provider(
        window.ethereum,
        "any"
      );
      set_provider(provider);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      setSigner(signer);

      const user_address = await signer.getAddress();
      set_signer_address(user_address);

      // const checkUser = await db
      //   .collection("User")
      //   .where("id", "==", user_address)
      //   .get();
      // if (checkUser.data.length === 0) {
      //   const res = await db
      //     .collection("User")
      //     .create([user_address, "", "", "", "", ""]);
      // }

      const user_balance = await signer.getBalance();
      const signerToStr = ethers.utils.formatEther(user_balance.toString());
      set_signer_bal(signerToStr);

      const formatBalance = parseFloat(signerToStr).toFixed(2);
      set_format_signer_bal(formatBalance);

      const { chainId } = await provider.getNetwork();
      set_current_chainId(chainId);
      setChainIdMain(chainId);
      console.log(chainIdMain)
    } else {
      console.log("No wallets detected");
    }
  };

  // signing out wallet
  const signOut = async () => {
    set_signer_address("");
    setSigner();
  };

  return (
    <>
      <Navbar
        Rarfinite_CHANNEL_ADDRESS={Rarfinite_CHANNEL_ADDRESS}
        connectToWallet={connectToWallet}
        signer={signer}
        signer_address={signer_address}
        signer_bal={format_signer_bal}
        chainIdMain={chainIdMain}
        signOut={signOut}
      />
      <Component {...pageProps} />
      <Footer />
    </>)
}
