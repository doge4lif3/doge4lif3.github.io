// -----------------
// React Wallet Status Component
// -----------------
function WalletStatus() {
const [connected, setConnected] = React.useState(false);
const [balance, setBalance] = React.useState(0);

const toggleConnection = () => {
if (!connected) {
// Simulate fetching wallet balance
setBalance((Math.random() * 10).toFixed(2));
}
setConnected(!connected);
};

return (
<div style={{
padding: "10px",
border: "1px solid #ccc",
borderRadius: "8px",
maxWidth: "200px",
textAlign: "center",
fontFamily: "Arial, sans-serif",
marginTop: "10px"
}}>
<p>{connected ? "✅ Connected" : "❌ Disconnected"}</p>
{connected && <p>Balance: {balance} DOGE</p>}
<button onClick={toggleConnection}>
{connected ? "Disconnect" : "Connect Wallet"}
</button>
</div>
);
}

// Mount React component into <div id="wallet-status">
const walletRoot = ReactDOM.createRoot(document.getElementById("wallet-status"));
walletRoot.render(<WalletStatus />);