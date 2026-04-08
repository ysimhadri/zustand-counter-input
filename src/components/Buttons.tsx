import React from 'react';

const bankLinks = [
    'https://www.citi.com/?loginScreenId=inactivityHomePage',
    'https://www.wellsfargo.com/',
    'https://www.americanexpress.com/en-us/account/login?inav=iNavLnkLog',
    'https://verified.capitalone.com/auth/signin?Product=ENTERPRISE&goto_url=https:%2F%2Fmyaccounts.capitalone.com%2F%23%2Fwelcome#/welcome',
    'https://chase.com'
];

const merchantLinks = ['https://www.amazon.com', 'https://www.bestbuy.com', 'https://www.greentoe.com'];



export const Buttons: React.FC = () => {
    const handleBanks = () => {
        bankLinks.forEach((url, i) => {
            setTimeout(() => window.open(url, '_blank', 'noopener,noreferrer'), i * 100);
        });
    };

    const handleMerchants = () => {
        merchantLinks.forEach((url, i) => {
            setTimeout(() => window.open(url, '_blank', 'noopener,noreferrer'), i * 100);
        });
    };



    return (
        <div className="card">
            <div className="buttons-container" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <button className="btn" onClick={handleBanks}>Banks</button>
                <button className="btn" onClick={handleMerchants}>Merchants</button>
                <button className="btn">Button 3</button>
                <button className="btn">Button 4</button>
                <button className="btn">Button 5</button>
            </div>
        </div>
    );
};
