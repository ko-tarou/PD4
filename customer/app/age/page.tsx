'use client';

export default function AgeVerification() {
  const selectAge = (age: string) => {
    console.log('選択された年齢層:', age);
    alert('選択された年齢層: ' + age);
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: '#f0f0f0',
      fontFamily: "'Hiragino Sans', 'Hiragino Kaku Gothic ProN', Meiryo, sans-serif"
    }}>
      <div style={{
        width: '840px',
        height: '700px',
        background: 'white',
        border: '3px solid white',
        borderRadius: '20px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '60px',
        position: 'relative'
      }}>
        {/* Corner decorations */}
        <div style={{
          position: 'absolute',
          width: '40px',
          height: '40px',
          border: '4px solid white',
          top: '-4px',
          left: '-4px',
          borderRight: 'none',
          borderBottom: 'none'
        }} />
        <div style={{
          position: 'absolute',
          width: '40px',
          height: '40px',
          border: '4px solid white',
          top: '-4px',
          right: '-4px',
          borderLeft: 'none',
          borderBottom: 'none'
        }} />
        <div style={{
          position: 'absolute',
          width: '40px',
          height: '40px',
          border: '4px solid white',
          bottom: '-4px',
          left: '-4px',
          borderRight: 'none',
          borderTop: 'none'
        }} />
        <div style={{
          position: 'absolute',
          width: '40px',
          height: '40px',
          border: '4px solid white',
          bottom: '-4px',
          right: '-4px',
          borderLeft: 'none',
          borderTop: 'none'
        }} />
        
        <h1 style={{
          fontSize: '42px',
          fontWeight: 'bold',
          color: '#333',
          marginBottom: '30px',
          letterSpacing: '2px'
        }}>
          年齢確認
        </h1>
        
        <p style={{
          fontSize: '20px',
          color: '#666',
          marginBottom: '50px',
          letterSpacing: '1px'
        }}>
          ご注文に進む前に年齢をお選びください
        </p>
        
        <button 
          onClick={() => selectAge('12以下')}
          style={{
            width: '450px',
            height: '80px',
            background: 'linear-gradient(180deg, #ff9d2e 0%, #ff8c00 100%)',
            border: 'none',
            borderRadius: '50px',
            fontSize: '26px',
            fontWeight: 'bold',
            color: 'white',
            cursor: 'pointer',
            margin: '12px 0',
            boxShadow: '0 6px 0 #d97700',
            letterSpacing: '2px',
            transition: 'all 0.1s'
          }}
        >
          12歳以下
        </button>
        
        <button 
          onClick={() => selectAge('12以上')}
          style={{
            width: '450px',
            height: '80px',
            background: 'linear-gradient(180deg, #ff9d2e 0%, #ff8c00 100%)',
            border: 'none',
            borderRadius: '50px',
            fontSize: '26px',
            fontWeight: 'bold',
            color: 'white',
            cursor: 'pointer',
            margin: '12px 0',
            boxShadow: '0 6px 0 #d97700',
            letterSpacing: '2px',
            transition: 'all 0.1s'
          }}
        >
          12歳以上
        </button>
        
        <button 
          onClick={() => selectAge('60以上')}
          style={{
            width: '450px',
            height: '80px',
            background: 'linear-gradient(180deg, #ff9d2e 0%, #ff8c00 100%)',
            border: 'none',
            borderRadius: '50px',
            fontSize: '26px',
            fontWeight: 'bold',
            color: 'white',
            cursor: 'pointer',
            margin: '12px 0',
            boxShadow: '0 6px 0 #d97700',
            letterSpacing: '2px',
            transition: 'all 0.1s'
          }}
        >
          60歳以上
        </button>
      </div>
    </div>
  );
}