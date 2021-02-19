import React from 'react';
import './App.css';

const queries=[
  //{ name:"Check debug api",    url:""                            , description:"" },
  { name:"Health",             url:"health"                      , description:"Get health of node" },
  { name:"Readiness",          url:"readiness"                   , description:"Get readiness state of node" },
  { name:"Check Peers",        url:"peers"                       , description:"Get a list of peers" },
  { name:"Check Topology",     url:"topology"                    , description:"Get topology of known network" },
  { name:"Addresses",          url:"adresses"                    , description:"Get overlay and underlay addresses of the node" },
  { name:"Blocklist",          url:"blocklist"                   , description:"Get a list of blocklisted peers" },
  { name:"Balance",            url:"balances"                    , description:"Get the balances with all known peers including prepaid services"},
  { name:"Consumed",           url:"consumed"                    , description:"Get the past due consumption balances with all known peers"},
  { name:"Checkbook Address",  url:"chequebook/address"          , description:"Get the address of the chequebook contract used"},
  { name:"Checkbook Balance",  url:"chequebook/balance"          , description:"Get the balance of the chequebook"},
  { name:"Cheques ",           url:"chequebook/cheque"           , description:"Get last cheques for all peers" },
  { name:"Cheque For Peer ",   url:"chequebook/cheque/{peer-id}" , description:"Get last cheques for the peer" },
  { name:"Settlements",        url:"settlements"                 , description:"Get settlements with all known peers and total amount sent or received" },
  { name:"Settlements For",    url:"settlements/{address}"       , description:"Get amount of sent and received from settlements with a peer" },
  { name:"Tags",               url:"tags/{uid}"                  , description:"Get Tag information using Uid" }, 
  { name:"Pinned Chunks",      url:"pin/chunks"                  , description:"Get list of pinned chunks" }, 
];

const commands=[        
  { name:"Welcome",            url:"welcome-message"             , description:"Set P2P welcome message", method:"post" },
  { name:"Connect",            url:"connect/{multiAddress}"      , description:""},
  { name:"Peers",              url:"connect/{address}"           , description:""},
  { name:"PingPong",           url:"pingpong/{peer-id}"          , description:""}, 
        
  { name:"Balances",           url:"balances/{address}"          , description:"Get the balances with a specific peer including prepaid services"},
  { name:"Consumed",           url:"consumed/{address}"          , description:"Get the past due consumption balance with a specific peer"},
  { name:"Last Cashout",       url:"chequebook/cashout/{peer-id}", description:"Get last cashout action for the peer"},
  { name:"Cashout ",           url:"chequebook/cashout/{peer-id}", description:"Get last cashout action for the peer", method:"post" },
  { name:"Chunk ",             url:"chunks/{address}"            , description:"Check if chunk at address exists locally" },

  { name:"Delete Chunk ",      url:"chunks/{address}"            , description:"Delete a chunk from local storage", method:"delete" },

  { name:"deposit ",           url:"chequebook/deposit"          , description:"Deposit tokens from overlay address into chequebook", method:"post" }, // amount
  { name:"withdraw ",          url:"chequebook/withdraw"         , description:"Withdraw tokens from the chequebook to the overlay address", method:"post" }, // amount
];

async function onFetchFromUrl(url, method='get')
{
  try {
    const response = await fetch(url,
      {
        //mode: 'no-cors',
        mode: 'cors',
        method: method,
        credentials: 'include', 
        headers: {
          "Access-Control-Allow-Origin": "*",
          //"Access-Control-Allow-Origin": "http://localhost",
          'Accept': 'application/json',
          "Accept-Encoding": "gzip, deflate, br",
          "Content-Type": "text/plain",
        }
    });
    

    if (!response.ok) {
      const message = `An error has occured: ${response.status}`;
      //throw new Error(message);
    }
   
    var data = await response.text();
    //debugger;
    console.log(url, data);
    return data;

  } catch(e)
  {
    console.error(url, e);
  }
  return null;
}
class BeeChecker extends React.Component
{
  constructor(props){
      super(props);
      this.state = {
        status: "",         
        urlBee:    'http://localhost', 
        debugPort: '1635', 
        debugAPi:            false,
        connectedToEthereum: false,
        connectionRefused:   true,
        connectionWaiting:   true,
        checkbookDeployed:   false,
        missingBzz:          true,
        missinggEth:         true,
        gotPeers:            false,
        accumulatedBalance:  false,
        accumulatedCheques:  false,
        availableBalance:    false,
        results:[]
      };

      this.getData = this.getData.bind(this);
  }

  getUrl(postfix){
    return this.state.urlBee+":"+this.state.debugPort+"/"+postfix;
  }

  componentDidMount() { 
      this.getData();
      this.intervalHandle = setInterval(this.getData, 5000); // every n
  }
  componentWillUnmount() { 
    clearInterval(this.intervalHandle); 
  }
  async getData() {  
    var newResults = [];
    for(const q of queries)
    {
      q.results = await onFetchFromUrl(this.getUrl(q.url));
      newResults.push(q.results);
    }
    this.setState({results:newResults});
  }  
  render()
  {
    return(<>
            <span>{this.state.status}</span>
            <ul>{this.getUrl("")} 
              <li>
                 
              </li>
            </ul>
          </>
    )
  }
}

function App() {
  return (
    <div className="App">
      <header className="App-header">Carpenter Bee</header> 
      <BeeChecker />
    </div>
  );
}

export default App;
