import { useEffect, useState } from "react";
import "./App.css";
import { countries } from "./countries";

type Rates = {
  result: string;
  conversion_rates: Record<string, string>;
};

function App() {
  const [amount, setAmount] = useState(0);
  const [from, setFrom] = useState<null | { code: string; currency: string }>({
    code: "CA",
    currency: "CAD",
  });
  const [showFromDropdown, setShowFromDropdown] = useState(false);

  const [rates, setRates] = useState<null | Rates>(null);

  const [error, setError] = useState<null | string>(null);

  useEffect(() => {
    setRates(null);
  }, [from]);

  const getRates = async () => {
    if (amount <= 0) {
      setError("Please enter an amount more than 0.");
      setRates(null);
      return;
    }

    try {
      const response = await fetch(
        `https://v6.exchangerate-api.com/v6/${process.env.REACT_APP_API_KEY}/latest/${from?.currency}`
      );

      const data = await response.json();

      setRates(data);
      setError(null);
    } catch (error) {
      setRates(null);
      setError("Some error occurred. Please try again!");
    }
  };
  return (
    <div className="App">
      <h1>Currency Converter</h1>
      {error ? <span className="error">{error}</span> : null}
      <div className="amount">
        <label htmlFor="amount">Amount</label>
        <input
          name="amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(+e.target.value)}
          placeholder="Amount"
        />
      </div>

      <div className="countries">
        <button
          className="countries-dropdown-button"
          onClick={() => setShowFromDropdown((prev) => !prev)}
        >
          {from?.code ? (
            <img
              src={`https://flagcdn.com/24x18/${from?.code?.toLowerCase()}.png`}
              alt="arrow"
            />
          ) : null}

          <div>{from?.currency}</div>
        </button>
        {showFromDropdown && (
          <div className="countries-dropdown">
            {Object.entries(countries).map(([key, value]) => (
              <span
                key={key}
                onClick={() => {
                  setShowFromDropdown(false);
                  setFrom({ code: value, currency: key });
                }}
              >
                <img
                  src={`https://flagcdn.com/24x18/${value.toLowerCase()}.png`}
                  alt="arrow"
                />
                {key}
              </span>
            ))}
          </div>
        )}
      </div>
      <button className="get-rates-button" onClick={() => getRates()}>
        Get Rates
      </button>

      <hr />

      <table className="rates">
        <tbody>
          {rates?.result === "success"
            ? Object.entries(rates?.conversion_rates).map(([key, value]) =>
                countries[key] ? (
                  <tr key={key}>
                    <td>
                      <img
                        src={`https://flagcdn.com/24x18/${from?.code?.toLowerCase()}.png`}
                        alt="arrow"
                      />
                    </td>
                    <td>{from?.currency}</td>
                    <td>{amount}</td>
                    <td>=</td>
                    <td>{Math.round(+value * amount)}</td>
                    <td>{key}</td>
                    <td>
                      <img
                        src={`https://flagcdn.com/24x18/${countries[
                          key
                        ]?.toLowerCase()}.png`}
                        alt="arrow"
                      />
                    </td>
                  </tr>
                ) : null
              )
            : null}
        </tbody>
      </table>
    </div>
  );
}

export default App;
