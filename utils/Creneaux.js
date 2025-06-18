function genererCreneaux(debut = 9, fin = 17, interval = 30) {
  const creneaux = [];
  let heure = debut;
  let minute = 0;

  while (heure < fin || (heure === fin && minute === 0)) {
    const h = String(heure).padStart(2, '0');
    const m = String(minute).padStart(2, '0');
    creneaux.push(`${h}:${m}`);

    minute += interval;
    if (minute >= 60) {
      minute = 0;
      heure += 1;
    }
  }

  return creneaux;
}

module.exports = genererCreneaux;
