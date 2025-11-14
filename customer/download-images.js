const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

// 画像がない商品リスト（商品名と画像URLのマッピング）
const missingItems = [
  { name: 'ポテト', url: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&h=300&fit=crop' },
  { name: 'キムチ', url: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=400&h=300&fit=crop' },
  { name: '餃子', url: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=400&h=300&fit=crop' },
  { name: '枝豆', url: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=400&h=300&fit=crop' },
  { name: '冷奴', url: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=400&h=300&fit=crop' },
  { name: 'サラダ', url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop' },
  { name: '刺身盛り合わせ', url: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=400&h=300&fit=crop' },
  { name: '漬物盛り合わせ', url: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=400&h=300&fit=crop' },
  { name: 'チーズ盛り合わせ', url: 'https://images.unsplash.com/photo-1618164436261-4473940d1f5c?w=400&h=300&fit=crop' },
  { name: 'ナムル', url: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=400&h=300&fit=crop' },
  { name: 'とんかつ', url: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=400&h=300&fit=crop' },
  { name: 'エビフライ', url: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=400&h=300&fit=crop' },
  { name: '天ぷら盛り合わせ', url: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=400&h=300&fit=crop' },
  { name: 'フライドポテト', url: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&h=300&fit=crop' },
  { name: 'チキンカツ', url: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=400&h=300&fit=crop' },
  { name: 'アジフライ', url: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=400&h=300&fit=crop' },
  { name: 'ビール', url: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop' },
  { name: 'ウーロン茶', url: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=300&fit=crop' },
];

const publicDir = path.join(__dirname, 'public');

// Picsum Photosを使用して画像をダウンロード（フォールバック）
function downloadImage(itemName, imageUrl) {
  return new Promise((resolve, reject) => {
    const filePath = path.join(publicDir, `${itemName}.jpg`);
    
    // URLをパース
    const urlObj = new URL(imageUrl);
    const client = urlObj.protocol === 'https:' ? https : http;
    
    client.get(imageUrl, (response) => {
      if (response.statusCode === 200 || response.statusCode === 301 || response.statusCode === 302) {
        // リダイレクトの処理
        if (response.statusCode === 301 || response.statusCode === 302) {
          const redirectUrl = response.headers.location;
          return downloadImage(itemName, redirectUrl).then(resolve).catch(reject);
        }
        
        const fileStream = fs.createWriteStream(filePath);
        response.pipe(fileStream);
        fileStream.on('finish', () => {
          fileStream.close();
          console.log(`✓ Downloaded: ${itemName}.jpg`);
          resolve();
        });
      } else {
        // フォールバック: Picsum Photosを使用
        const picsumUrl = `https://picsum.photos/400/300?random=${Date.now()}`;
        console.log(`Trying fallback for ${itemName}...`);
        https.get(picsumUrl, (picsumResponse) => {
          if (picsumResponse.statusCode === 200) {
            const fileStream = fs.createWriteStream(filePath);
            picsumResponse.pipe(fileStream);
            fileStream.on('finish', () => {
              fileStream.close();
              console.log(`✓ Downloaded (fallback): ${itemName}.jpg`);
              resolve();
            });
          } else {
            console.error(`✗ Failed to download ${itemName}: ${picsumResponse.statusCode}`);
            reject(new Error(`HTTP ${picsumResponse.statusCode}`));
          }
        }).on('error', (err) => {
          console.error(`✗ Error downloading ${itemName}:`, err.message);
          reject(err);
        });
      }
    }).on('error', (err) => {
      // フォールバック: Picsum Photosを使用
      const picsumUrl = `https://picsum.photos/400/300?random=${Date.now()}`;
      console.log(`Trying fallback for ${itemName}...`);
      https.get(picsumUrl, (picsumResponse) => {
        if (picsumResponse.statusCode === 200) {
          const fileStream = fs.createWriteStream(filePath);
          picsumResponse.pipe(fileStream);
          fileStream.on('finish', () => {
            fileStream.close();
            console.log(`✓ Downloaded (fallback): ${itemName}.jpg`);
            resolve();
          });
        } else {
          console.error(`✗ Failed to download ${itemName}: ${picsumResponse.statusCode}`);
          reject(new Error(`HTTP ${picsumResponse.statusCode}`));
        }
      }).on('error', (err2) => {
        console.error(`✗ Error downloading ${itemName}:`, err2.message);
        reject(err2);
      });
    });
  });
}

// すべての画像をダウンロード
async function downloadAllImages() {
  console.log('Starting image downloads...\n');
  
  for (const item of missingItems) {
    try {
      await downloadImage(item.name, item.url);
      // レート制限を避けるために少し待機
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (error) {
      console.error(`Failed to download ${item.name}:`, error.message);
    }
  }
  
  console.log('\nDownload complete!');
}

downloadAllImages();

