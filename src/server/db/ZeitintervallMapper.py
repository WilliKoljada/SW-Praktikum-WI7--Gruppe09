from server.bo.Zeitintervall import Zeitintervall
from server.db.Mapper import Mapper


class ZeitintervallMapper(Mapper):
    """Mapper-Klasse, die Konversation-Objekte auf eine relationale
    Datenbank abbildet. Hierzu wird eine Reihe von Methoden zur Verfügung
    gestellt, mit deren Hilfe z.B. Objekte gesucht, erzeugt, modifiziert und
    gelöscht werden können.
    """

    def __init__(self):
        super().__init__()

    def find_all(self):
        """Auslesen aller Zeitintervall.
        :return Eine Sammlung mit Zeitintervall-Objekten, die sämtliche Zeitintervall repräsentieren.
        """
        result = []
        cursor = self._cnx.cursor()
        cursor.execute("SELECT * from zeitintervall")
        tuples = cursor.fetchall()

        for (id, datum, startzeit, endzeit, aktivitaetID, personID) in tuples:
            zeitintervall = Zeitintervall()
            zeitintervall.set_id(id)
            zeitintervall.set_datum(datum)
            zeitintervall.set_startzeit(startzeit)
            zeitintervall.set_endzeit(endzeit)
            zeitintervall.set_aktivitaetID(aktivitaetID)
            zeitintervall.set_personID(personID)
            result.append(zeitintervall)

        self._cnx.commit()
        cursor.close()

        return result

    def find_by_key(self, key):
        """Auslesen aller Zeitintervall anhand der ID,
        da diese vorgegeben ist, wird genau ein Objekt zurückgegeben.
        :param key Primärschlüsselattribut
        :return Zeitintervall-Objekt, das dem übergebenen Schlüssel entspricht, None bei
        nicht vorhandenem DB-Tupel
        """
        result = None

        cursor = self._cnx.cursor()
        command = "SELECT * FROM zeitintervall WHERE id={}".format(key)
        cursor.execute(command)
        tuples = cursor.fetchall()
        for (id, datum, startzeit, endzeit, aktivitaetID, personID) in tuples:
            zeitintervall = Zeitintervall()
            zeitintervall.set_id(id)
            zeitintervall.set_datum(datum)
            zeitintervall.set_startzeit(startzeit)
            zeitintervall.set_endzeit(endzeit)
            zeitintervall.set_aktivitaetID(aktivitaetID)
            zeitintervall.set_personID(personID)

            result = zeitintervall

        self._cnx.commit()
        cursor.close()
        return result

        def find_by_personID(self, personID):
            """Auslesen aller Zeitintervall anhand der ID,
            da diese vorgegeben ist, wird genau ein Objekt zurückgegeben.
            :param key Primärschlüsselattribut
            :return Zeitintervall-Objekt, das dem übergebenen Schlüssel entspricht, None bei
            nicht vorhandenem DB-Tupel
            """
            result = None

        cursor = self._cnx.cursor()
        cursor.execute("SELECT MAX(id) AS maxid FROM zeitintervall")
        tuples = cursor.fetchall()

        for (maxid) in tuples:
            if maxid[0] is not None:
                """Wenn wir eine maximale ID festellen konnten, zählen wir diese
                um 1 hoch und weisen diesen Wert als ID dem User-Objekt zu."""
                zeitintervall.set_id(maxid[0] + 1)
            else:
                """Wenn wir keine maximale ID feststellen konnten, dann gehen wir
                davon aus, dass die Tabelle leer ist und wir mit der ID 1 beginnen können."""
                zeitintervall.set_id(1)

        command = "INSERT INTO zeitintervall (id, creation_date, zeitintervall) VALUES (%s,%s,%s)"
        data = (zeitintervall.get_id(), zeitintervall.get_creation_date(), zeitintervall.get_projektlaufzeit())

        cursor.execute(command, data)

        self._cnx.commit()
        cursor.close()

        return zeitintervall

    def update(self, zeitintervall):
        """Wiederholtes Schreiben eines Objekts in die Datenbank.
        :param zeitintervall das Objekt, das in die DB geschrieben werden soll
        """
        cursor = self._cnx.cursor()

        command = "UPDATE zeitintervall SET creation_date=%s, zeitintervall=%s WHERE id=%s"
        data = ( zeitintervall.get_creation_date(), zeitintervall.get_projektlaufzeit(), zeitintervall.get_id())

        cursor.execute(command, data)

        self._cnx.commit()
        cursor.close()

    def delete(self, zeitintervall):
        """Löschen der Daten eines Projekt-Objekts aus der Datenbank.
        :param zeitintervall das aus der DB zu löschende "Objekt"
        """
        cursor = self._cnx.cursor()

        command = "DELETE FROM zeitintervall WHERE id={}".format(zeitintervall.get_id())
        cursor.execute(command)

        self._cnx.commit()
        cursor.close()

        return zeitintervall


    # Zum Testen ausführen
if (__name__ == "__main__"):
    with ZeitintervallMapper() as mapper:
            zeitintervall = Zeitintervall()
            zeitintervall.set_id(2)

            mapper.insert(zeitintervall)