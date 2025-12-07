
/* 
  INSTRUKSI INSTALASI:
  1. Buka Google Sheet Anda.
  2. Klik Ekstensi > Apps Script.
  3. Hapus semua kode yang ada, tempelkan kode ini.
  4. Simpan proyek.
  5. PENTING UNTUK MIGRASI/UPDATE STRUKTUR:
     - Di toolbar atas, pilih fungsi "populateInitialData".
     - Klik tombol "Run" (Jalankan).
     - Berikan izin akses jika diminta.
     - Script ini akan membuat sheet "Registrations" dan "Settings" jika belum ada.
  6. Klik Deploy > New Deployment > Web App > Execute as Me > Who has access: Anyone > Deploy.
  7. Copy URL Web App (jika berubah) ke file services/sheetsService.ts.
*/

// ID Spreadsheet (Otomatis menggunakan spreadsheet yang sedang aktif)
var SS = SpreadsheetApp.getActiveSpreadsheet();

// Nama Tab (Harus sama persis dengan di Sheet)
var SHEETS = {
  STUDENTS: "Students",
  PAYMENTS: "Payments",
  SCHEDULE: "Schedule",
  MATERIALS: "Materials",
  EVENTS: "Events",
  REGISTRATIONS: "Registrations",
  SETTINGS: "Settings" // Sheet Baru untuk Konfigurasi
};

/* --- FUNGSI MIGRASI DATA (JALANKAN UNTUK RESET/INIT) --- */

function populateInitialData() {
  setup(); // Pastikan sheet sudah dibuat

  // 1. Data Siswa (ID, Name, Class, Parent, Password, Phone, Address)
  var students = [
    ['SD001', 'Budi Santoso', 5, 'Agus Santoso', '123', '081234567890', 'Jl. Merdeka No. 1'],
    ['SD002', 'Siti Aminah', 3, 'Rahmat Hidayat', '123', '081987654321', 'Jl. Ahmad Yani No. 5'],
    ['SD003', 'Doni Pratama', 1, 'Eko Pratama', '123', '081223344556', 'Perum Indah Blok A'],
    ['SD004', 'Ani Wijaya', 6, 'Susilo Wijaya', '123', '081334455667', 'Jl. Sudirman No. 10']
  ];
  fillSheet(SHEETS.STUDENTS, students, 7); 

  // 2. Data Pembayaran
  var payments = [
    ['PAY001', 'SD001', 'Juli', 2024, 150000, 'LUNAS', '2024-07-10'],
    ['PAY002', 'SD001', 'Agustus', 2024, 150000, 'LUNAS', '2024-08-12'],
    ['PAY003', 'SD001', 'September', 2024, 150000, 'BELUM LUNAS', ''],
    ['PAY004', 'SD002', 'September', 2024, 150000, 'BELUM LUNAS', '']
  ];
  fillSheet(SHEETS.PAYMENTS, payments, 7);

  // 3. Data Jadwal
  var schedule = [
    ['S1-M-1', 1, 'Senin', '07:00 - 08:30', 'Upacara & Tematik', 'Bu Rini'],
    ['S1-M-2', 1, 'Senin', '08:30 - 09:30', 'Matematika Dasar', 'Pak Budi'],
    ['S5-M-1', 5, 'Senin', '07:00 - 07:45', 'Upacara', '-'],
    ['S5-M-2', 5, 'Senin', '07:45 - 09:15', 'Matematika', 'Pak Hartono']
  ];
  fillSheet(SHEETS.SCHEDULE, schedule, 6);

  // 4. Data Materi dengan Link Download
  var materials = [
    ['M1', 'Pengenalan Angka 1-100', 'Matematika', 1, 'Modul dasar mengenal angka.', 'https://example.com/modul-matematika.pdf'],
    ['M3', 'Pecahan Sederhana', 'Matematika', 5, 'Panduan memahami pecahan.', 'https://example.com/modul-pecahan.pdf']
  ];
  fillSheet(SHEETS.MATERIALS, materials, 6);

  // 5. Data Event
  var events = [
    ['E1', 'Pembagian Rapor', '20 Desember 2024', 'Pengambilan rapor semester ganjil', 'academic'],
    ['E2', 'Libur Semester', '23 Des - 5 Jan 2025', 'Libur panjang semester ganjil', 'holiday']
  ];
  fillSheet(SHEETS.EVENTS, events, 5);

  // 6. Settings (Tahun Ajaran)
  var settings = [
    ['academicYear', '2024/2025']
  ];
  fillSheet(SHEETS.SETTINGS, settings, 2);

  // 7. Data Registrasi (Tidak di-reset)
}

function fillSheet(sheetName, data, totalColumns) {
  var sheet = SS.getSheetByName(sheetName);
  var lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    sheet.getRange(2, 1, lastRow - 1, totalColumns).clearContent();
  }
  if (data.length > 0) {
    sheet.getRange(2, 1, data.length, data[0].length).setValues(data);
  }
}

/* --- API ENTRY POINTS --- */

function doGet(e) {
  var action = e.parameter.action;
  var data = {};

  if (action == "getAll") {
    data.students = getSheetData(SHEETS.STUDENTS);
    data.payments = getSheetData(SHEETS.PAYMENTS);
    data.schedule = getSheetData(SHEETS.SCHEDULE);
    data.materials = getSheetData(SHEETS.MATERIALS);
    data.events = getSheetData(SHEETS.EVENTS);
    data.settings = getSheetData(SHEETS.SETTINGS);
  } else {
    data = { message: "Selamat datang di API SD Mudel" };
  }

  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    if (!e.postData || !e.postData.contents) {
      return ContentService.createTextOutput(JSON.stringify({ success: false, message: "No post data" }))
      .setMimeType(ContentService.MimeType.JSON);
    }

    var params = JSON.parse(e.postData.contents);
    var action = params.action;
    var result = { success: false, message: "Unknown action" };

    if (action === "registerStudent") {
      result = registerStudent(params.data);
    } else if (action === "registerApplicant") {
      result = registerApplicant(params.data);
    } else if (action === "updatePayment") {
      result = updatePayment(params.data);
    } else if (action === "updateStudent") {
      result = updateStudent(params.data);
    }

    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/* --- LOGIC FUNGSI --- */

function registerApplicant(data) {
  var sheet = SS.getSheetByName(SHEETS.REGISTRATIONS);
  if (!sheet) {
    createSheetIfNotExist(SHEETS.REGISTRATIONS, ["id", "fullName", "targetClass", "parentName", "phone", "address", "status", "registrationDate"]);
    sheet = SS.getSheetByName(SHEETS.REGISTRATIONS);
  }

  var id = "REG" + new Date().getTime();
  var date = new Date().toLocaleDateString("id-ID");

  sheet.appendRow([
    id,
    data.fullName,
    data.targetClass,
    data.parentName,
    data.phone,
    data.address,
    "PENDING",
    date
  ]);

  return { success: true, message: "Pendaftaran berhasil diterima", id: id };
}

function registerStudent(studentData) {
  var sheet = SS.getSheetByName(SHEETS.STUDENTS);
  if (!sheet) return { success: false, message: "Sheet Students tidak ditemukan" };

  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] == studentData.id) { 
      return { success: false, message: "NIS sudah terdaftar" };
    }
  }

  var newId = studentData.id || "SD" + Math.floor(Math.random() * 10000);
  
  sheet.appendRow([
    newId,
    studentData.name || studentData.fullName, 
    studentData.classLevel || studentData.targetClass,
    studentData.parentName,
    studentData.password || "123456",
    studentData.phone || "",
    studentData.address || ""
  ]);

  createDefaultPayments(newId);
  return { success: true, message: "Siswa berhasil didaftarkan", id: newId };
}

function updateStudent(studentData) {
  var sheet = SS.getSheetByName(SHEETS.STUDENTS);
  if (!sheet) return { success: false, message: "Sheet Students tidak ditemukan" };

  var data = sheet.getDataRange().getValues();
  var rowIndex = -1;

  for (var i = 1; i < data.length; i++) {
    if (data[i][0] == studentData.id) {
      rowIndex = i + 1; 
      break;
    }
  }

  if (rowIndex > -1) {
    if (studentData.name) sheet.getRange(rowIndex, 2).setValue(studentData.name);
    if (studentData.parentName) sheet.getRange(rowIndex, 4).setValue(studentData.parentName);
    if (studentData.password) sheet.getRange(rowIndex, 5).setValue(studentData.password);
    if (studentData.phone) sheet.getRange(rowIndex, 6).setValue(studentData.phone);
    if (studentData.address) sheet.getRange(rowIndex, 7).setValue(studentData.address);
    return { success: true, message: "Data berhasil diperbarui" };
  } else {
    return { success: false, message: "ID Siswa tidak ditemukan" };
  }
}

function updatePayment(paymentData) {
  var sheet = SS.getSheetByName(SHEETS.PAYMENTS);
  if (!sheet) return { success: false, message: "Sheet Payments tidak ditemukan" };

  var data = sheet.getDataRange().getValues();
  var rowIndex = -1;

  for (var i = 1; i < data.length; i++) {
    if (data[i][0] == paymentData.id) {
      rowIndex = i + 1; 
      break;
    }
  }

  if (rowIndex > -1) {
    sheet.getRange(rowIndex, 6).setValue(paymentData.status);
    sheet.getRange(rowIndex, 7).setValue(paymentData.datePaid);
    return { success: true, message: "Pembayaran berhasil diupdate" };
  } else {
    return { success: false, message: "ID Pembayaran tidak ditemukan" };
  }
}

function createDefaultPayments(studentId) {
  var sheet = SS.getSheetByName(SHEETS.PAYMENTS);
  var months = ['Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember', 'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni'];
  var year = 2024;
  
  months.forEach(function(month) {
    var payId = "PAY-" + studentId + "-" + month.substring(0,3).toUpperCase();
    sheet.appendRow([payId, studentId, month, year, 150000, "BELUM LUNAS", ""]);
  });
}

function getSheetData(sheetName) {
  var sheet = SS.getSheetByName(sheetName);
  if (!sheet) return [];
  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  var result = [];
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    var obj = {};
    for (var j = 0; j < headers.length; j++) {
      obj[headers[j]] = row[j];
    }
    result.push(obj);
  }
  return result;
}

function setup() {
  createSheetIfNotExist(SHEETS.STUDENTS, ["id", "name", "classLevel", "parentName", "password", "phone", "address"]);
  createSheetIfNotExist(SHEETS.PAYMENTS, ["id", "studentId", "month", "year", "amount", "status", "datePaid"]);
  createSheetIfNotExist(SHEETS.SCHEDULE, ["id", "classLevel", "day", "period", "subject", "teacher"]);
  createSheetIfNotExist(SHEETS.MATERIALS, ["id", "title", "subject", "classLevel", "description", "downloadUrl"]);
  createSheetIfNotExist(SHEETS.EVENTS, ["id", "title", "date", "description", "category"]);
  createSheetIfNotExist(SHEETS.REGISTRATIONS, ["id", "fullName", "targetClass", "parentName", "phone", "address", "status", "registrationDate"]);
  createSheetIfNotExist(SHEETS.SETTINGS, ["key", "value"]);
}

function createSheetIfNotExist(name, headers) {
  var sheet = SS.getSheetByName(name);
  if (!sheet) {
    sheet = SS.insertSheet(name);
    sheet.appendRow(headers);
  }
}
