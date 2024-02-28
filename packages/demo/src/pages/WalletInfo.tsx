// Copyright 2019-2022 @subwallet/sub-connect authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useContext, useEffect, useState } from 'react';

import AccountList from '../components/account/AccountList';
import WalletMetadata from '../components/sub_action/metadata/WalletMetadata';
import { useNavigate } from "react-router-dom";
import {useConnectWallet, useSetChain} from "@subwallet_connect/react";
import { HeaderWalletInfo } from "../components/header/HeaderWalletInfo";
import styled from "styled-components";
import {ThemeProps} from "../types";
import CN from "classnames";
import {NetworkInfo} from "../utils/network";
import {substrateApi} from "../utils/api/substrateApi";
import {Account} from "@subwallet_connect/core/dist/types";
import TransactionModal from "../components/transaction/TransactionModal";
import {ScreenContext} from "../context/ScreenContext";


interface Props extends ThemeProps {};


function Component ({className}: Props): React.ReactElement {
  const navigate = useNavigate();
  const [ { wallet}] = useConnectWallet();
  const [ substrateProvider, setSubstrateProvider ] = useState<substrateApi>();
  const [ currentAccountToTransaction, setCurrentAccountToTransaction ] = useState<Account>();
  const [{ chains }] = useSetChain();
  const { isWebUI } = useContext(ScreenContext);

  useEffect(() => {
    if(wallet?.type=== "evm")  navigate('/evm-wallet-info');
    if(!wallet) return;
      const {namespace: namespace_, id: chainId} = wallet.chains[0];
      const chainInfo = chains.find(({id, namespace}) => id === chainId && namespace === namespace_);
      if (chainInfo) {
        const ws = NetworkInfo[chainInfo.label as string].wsProvider;
        if (ws) {
          setSubstrateProvider(new substrateApi(ws));
        }
      }
  }, [wallet]);

  return (
  <div className={CN('__wallet-info-page', className, {
    '-isMobile': !isWebUI
  })}>
    <div className={'__wallet-info-body'}>
      <div className={'__wallet-info-box'}>
        <div className={'__wallet-info-label'}>
          Account List
        </div>
        <AccountList substrateProvider={substrateProvider} setAddressToTransaction={setCurrentAccountToTransaction}/>
      </div>
      <div className={'__wallet-info-box'}>
        {!! wallet?.metadata &&
          <>
              <div className={'__wallet-info-label'}>
                  Metadata
              </div>
              <WalletMetadata/>
          </>
        }
      </div>
    </div>
    {
      currentAccountToTransaction && <TransactionModal senderAccount={currentAccountToTransaction} substrateProvider={substrateProvider}/>
    }
  </div>
  );
}

const WalletInfo = styled(Component)<Props>(({theme: {token}}) => {

  return {

    '&.__wallet-info-page': {
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      gap: token.padding
    },

    '&.-isMobile': {
      '.__wallet-info-body': {
        marginTop: 0
      }
    },

    '.__wallet-info-body': {
      display: 'flex',
      gap: token.paddingMD,
      flexWrap: 'wrap',
      width: '100%',
      marginTop: 230
    },

    '.__wallet-info-box': {
      display: 'flex',
      flexDirection: 'column',
      flex: '1 1 576px'
    },

    '.__wallet-info-label': {
      fontSize: 24,
      fontStyle: 'normal',
      fontWeight: 600,
      lineHeight: '32px',
      marginBottom: token.margin
    }

  }
})


export default WalletInfo;
