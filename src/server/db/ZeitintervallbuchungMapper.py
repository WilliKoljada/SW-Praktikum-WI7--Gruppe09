from src.server.bo.Zeitintervallbuchung import Zeitintervallbuchung
from src.server.db.Mapper import Mapper


class ZeitintervallbuchungMapper(Mapper):
    """Mapper-Klasse, die Konversation-Objekte auf eine relationale
    Datenbank abbildet. Hierzu wird eine Reihe von Methoden zur Verfügung
    gestellt, mit deren Hilfe z.B. Objekte gesucht, erzeugt, modifiziert und
    gelöscht werden können.
    """

    def __init__(self):
        super().__init__()

    def find_all(self):
        """Auslesen aller Zeitintervallbuchung.
        :return Eine Sammlung mit Zeitintervallbuchung-Objekten, die sämtliche Zeitintervallbuchung repräsentieren.
        """
        result = []
        cursor = self._cnx.cursor()
        cursor.execute("SELECT * from zeitintervallbuchung")
        tuples = cursor.fetchall()

        for (id,creation_date) in tuples:
            zeitintervallbuchung= Zeitintervallbuchung()
            zeitintervallbuchung.set_id(id)
            zeitintervallbuchung.set_creation_date(creation_date)
            result.append(zeitintervallbuchung)

        self._cnx.commit()
        cursor.close()

        return result

    def find_by_key(self, key):
        """Auslesen aller Zeitintervallbuchung anhand der ID,
        da diese vorgegeben ist, wird genau ein Objekt zurückgegeben.
        :param key Primärschlüsselattribut
        :return Zeitintervallbuchung-Objekt, das dem übergebenen Schlüssel entspricht, None bei
        nicht vorhandenem DB-Tupel
        """
        result = None

        cursor = self._cnx.cursor()
        command = "SELECT * FROM zeitintervallbuchung WHERE id={}".format(key)
        cursor.execute(command)
        tuples = cursor.fetchall()
        for (id, creation_date) in tuples:
            zeitintervallbuchung = Zeitintervallbuchung()
            zeitintervallbuchung.set_id(id)
            zeitintervallbuchung.set_creation_date(creation_date)

            result = zeitintervallbuchung

        self._cnx.commit()
        cursor.close()
        return result

    def insert(self, zeitintervallbuchung):
        """Einfügen eines Zeitintervallbuchung-Objekts in die Datenbank.
        Dabei wird auch der Primärschlüssel des übergebenen Objekts geprüft und ggf.
        berichtigt.
        :param zeitintervallbuchung das zu speichernde Objekt
        :return das bereits übergebene Objekt, jedoch mit ggf. korrigierter ID.
        """
        cursor = self._cnx.cursor()
        cursor.execute("SELECT MAX(id) AS maxid FROM zeitintervallbuchung")
        tuples = cursor.fetchall()

        for (maxid) in tuples:
            if maxid[0] is not None:
                """Wenn wir eine maximale ID festellen konnten, zählen wir diese
                um 1 hoch und weisen diesen Wert als ID dem User-Objekt zu."""
                zeitintervallbuchung.set_id(maxid[0] + 1)
            else:
                """Wenn wir keine maximale ID feststellen konnten, dann gehen wir
                davon aus, dass die Tabelle leer ist und wir mit der ID 1 beginnen können."""
                zeitintervallbuchung.set_id(1)

        command = "INSERT INTO zeitintervallbuchung (id, creation_date) VALUES (%s,%s)"
        data = (zeitintervallbuchung.get_id(), zeitintervallbuchung.get_creation_date())

        cursor.execute(command, data)

        self._cnx.commit()
        cursor.close()

        return zeitintervallbuchung

    def update(self, zeitintervallbuchung):
        """Wiederholtes Schreiben eines Objekts in die Datenbank.
        :param zeitintervallbuchung das Objekt, das in die DB geschrieben werden soll
        """
        cursor = self._cnx.cursor()

        command = "UPDATE zeitintervallbuchung SET creation_date=%s WHERE id=%s"
        data = (zeitintervallbuchung.get_creation_date(), zeitintervallbuchung.get_id())

        cursor.execute(command, data)

        self._cnx.commit()
        cursor.close()

    def delete(self, zeitintervallbuchung):
        """Löschen der Daten eines Projekt-Objekts aus der Datenbank.
        :param zeitintervallbuchung das aus der DB zu löschende "Objekt"
        """
        cursor = self._cnx.cursor()

        command = "DELETE FROM zeitintervallbuchung WHERE id={}".format(zeitintervallbuchung.get_id())
        cursor.execute(command)

        self._cnx.commit()
        cursor.close()

        return zeitintervallbuchung

    # Zum Testen ausführen
if (__name__ == "__main__"):
    with ZeitintervallbuchungMapper() as mapper:
            zeitintervallbuchung = Zeitintervallbuchung()
            zeitintervallbuchung.set_id("Zeitintervallbuchung")
            zeitintervallbuchung.set_id(2)

            mapper.insert(zeitintervallbuchung)

