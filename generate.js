const cfonts = require('cfonts');
const readline = require('readline');
const fs = require('fs');

// Membuat interface untuk input pengguna
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Menampilkan banner dengan cfonts
cfonts.say('Gmail Dot Generator', {
  font: 'block',              // Font bergaya block
  align: 'center',           // Posisi tengah
  colors: ['cyan', 'blue'],  // Gradasi warna cyan ke blue
  background: 'transparent', // Latar belakang transparan
  letterSpacing: 1,          // Jarak antar huruf
  lineHeight: 1,             // Tinggi baris
  space: true,               // Spasi di sekitar teks
  maxLength: '0'             // Tidak ada batas panjang
});

// Menampilkan teks kredit dengan emoji
console.log('\n✨ Script coded by - @balveerxyz | Channel Tele: t.me/airdroplocked | Gmail Dot Generator 🚀\n');

// Fungsi untuk menghasilkan semua kombinasi dot
function generateDotVariations(localPart) {
  const variations = new Set();
  
  // Fungsi rekursif untuk menghasilkan kombinasi dot
  function generate(current, remaining, result) {
    if (remaining.length === 0) {
      if (current.length > 0) {
        result.add(current);
      }
      return;
    }
    
    // Tanpa dot
    generate(current + remaining[0], remaining.slice(1), result);
    
    // Dengan dot (kecuali di akhir)
    if (remaining.length > 1) {
      generate(current + remaining[0] + '.', remaining.slice(1), result);
    }
  }
  
  generate('', localPart, variations);
  return [...variations];
}

// Prompt untuk input email
rl.question('📧 Masukkan email (Gmail only): ', (email) => {
  // Validasi email
  if (!email.toLowerCase().endsWith('@gmail.com')) {
    console.log('❌ Harap masukkan alamat Gmail yang valid! 😞');
    rl.close();
    return;
  }
  
  // Ekstrak bagian lokal (sebelum @gmail.com)
  const localPart = email.split('@')[0];
  
  // Validasi bagian lokal (hanya huruf, angka, tanpa dot atau karakter khusus)
  if (!/^[a-zA-Z0-9]+$/.test(localPart)) {
    console.log('⚠️ Bagian lokal email hanya boleh berisi huruf dan angka (tanpa dot atau karakter khusus)! 😕');
    rl.close();
    return;
  }
  
  // Prompt untuk jumlah variasi
  rl.question('🔢 Mau berapa variasi email? (masukkan angka): ', (numInput) => {
    const maxVariations = parseInt(numInput);
    
    // Validasi input jumlah
    if (isNaN(maxVariations) || maxVariations < 1) {
      console.log('❌ Masukkan angka yang valid (minimal 1)! 😞');
      rl.close();
      return;
    }
    
    // Hasilkan variasi dot
    const variations = generateDotVariations(localPart);
    
    // Batasi jumlah variasi sesuai input pengguna
    const limitedVariations = variations.slice(0, Math.min(maxVariations, variations.length));
    
    // Tampilkan hasil dengan emoji
    console.log('\n🎉 Variasi Dot untuk ' + email + ' 🎉');
    console.log(`✅ Total variasi: ${variations.length} 🎈`);
    console.log('========================================');
    limitedVariations.forEach((variation, index) => {
      console.log(`🔹 ${index + 1}. ${variation}@gmail.com`);
    });
    console.log('========================================');
    
    // Simpan variasi ke file generated.txt
    const outputContent = limitedVariations.map((variation, index) => `${index + 1}. ${variation}@gmail.com`).join('\n');
    fs.writeFile('generated.txt', outputContent, (err) => {
      if (err) {
        console.log('❌ Gagal menyimpan ke file generated.txt: ' + err.message + ' 😞');
      } else {
        console.log('💾 Variasi email berhasil disimpan ke generated.txt! 🎉');
      }
      
      // Tutup readline
      rl.close();
    });
  });
});