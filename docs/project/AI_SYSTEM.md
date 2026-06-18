# ChordPulse AI System

## MVP Durumu

AI özellikleri MVP kapsamında uygulanmadı. Altyapı Faz 4 roadmap'inde planlandı.

## Planlanan AI Yetenekleri

### 1. İş Süresi Tahmini
- Girdi: jobType, quantity, crewName, systemCategory
- Model: geçmiş iş süreleri üzerinde regresyon
- Çıktı: tahmini teslim tarihi + güven aralığı

### 2. Stok Optimizasyonu
- Düşük stok eşiği otomatik önerisi
- İş hacmine göre kağıt sipariş miktarı tahmini

### 3. Prova Revizyon Analizi
- Müşteri notlarından revizyon neden sınıflandırması
- Tekrarlayan hata kalıpları raporu

## Entegrasyon Noktaları

- `DashboardService.getStats()` — trend verisi AI feature store'a beslenecek
- `RoofInspection.notes` — NLP analiz kaynağı
- `RoofingJob` geçmişi — süre tahmin eğitim verisi

## Guardrails

- Tenant izolasyonu (firmId) tüm AI sorgularında zorunlu
- Kişisel müşteri verisi model eğitimine dahil edilmez
- İnsan onayı olmadan otomatik iş durumu değişikliği yapılmaz
