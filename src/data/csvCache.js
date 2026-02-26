// CSV dosyaları için basit bellek içi önbellek
const csvCache = {};

/**
 * CSV dosyasını önbellekten veya ağdan yükle.
 * İlk çağrıda fetch yapar ve sonucu önbelleğe alır.
 * Sonraki çağrılarda önbellekten döndürür.
 */
export const fetchCSV = async (filename) => {
  if (csvCache[filename]) {
    return csvCache[filename];
  }

  const response = await fetch(`${process.env.PUBLIC_URL}/${filename}`);
  const text = await response.text();
  csvCache[filename] = text;
  return text;
};
