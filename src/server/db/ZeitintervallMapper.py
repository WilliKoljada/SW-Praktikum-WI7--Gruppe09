from server.bo.Zeitintervall import Zeitintervall
from server.db.Mapper import Mapper
from datetime import datetime


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
        cursor.execute("SELECT id, creation_date, datum, startzeit, endzeit, aktivitaetID, personID from zeitintervall")
        tuples = cursor.fetchall()

        for (id, creation_date, datum, startzeit, endzeit, aktivitaetID, personID) in tuples:
            zeitintervall= Zeitintervall()
            zeitintervall.set_id(id)
            zeitintervall.set_creation_date(creation_date)
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
        command = "SELECT id, creation_date, datum, startzeit, endzeit, aktivitaetID, personID FROM zeitintervall WHERE id={}".format(key)
        cursor.execute(command)
        tuples = cursor.fetchall()
        for (id, creation_date, datum, startzeit, endzeit, aktivitaetID, personID) in tuples:
            zeitintervall = Zeitintervall()
            zeitintervall.set_id(id)
            zeitintervall.set_creation_date(creation_date)
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
        command = "SELECT id, creation_date, datum, startzeit, endzeit, aktivitaetID, personID FROM zeitintervall WHERE personID={}".format(personID)
        cursor.execute(command)
        tuples = cursor.fetchall()
        for (id, creation_date, datum, startzeit, endzeit, aktivitaetID, personID) in tuples:
            zeitintervall = Zeitintervall()
            zeitintervall.set_id(id)
            zeitintervall.set_creation_date(creation_date)
            zeitintervall.set_datum(datum)
            zeitintervall.set_startzeit(startzeit)
            zeitintervall.set_endzeit(endzeit)
            zeitintervall.set_aktivitaetID(aktivitaetID)
            zeitintervall.set_personID(personID)

            result = zeitintervall

        self._cnx.commit()
        cursor.close()
        return result

    def find_by_aktivitaetID(self, aktivitaetID):
        """Auslesen aller Zeitintervall anhand der ID,
        da diese vorgegeben ist, wird genau ein Objekt zurückgegeben.
        :param key Primärschlüsselattribut
        :return Zeitintervall-Objekt, das dem übergebenen Schlüssel entspricht, None bei
        nicht vorhandenem DB-Tupel
        """
        result = None

        cursor = self._cnx.cursor()
        command = "SELECT id, creation_date, datum, startzeit, endzeit, aktivitaetID, personID FROM zeitintervall WHERE aktivitaetID={}".format(aktivitaetID)
        cursor.execute(command)
        tuples = cursor.fetchall()
        for (id, creation_date, datum, startzeit, endzeit, aktivitaetID, personID) in tuples:
            zeitintervall = Zeitintervall()
            zeitintervall.set_id(id)
            zeitintervall.set_creation_date(creation_date)
            zeitintervall.set_datum(datum)
            zeitintervall.set_startzeit(startzeit)
            zeitintervall.set_endzeit(endzeit)
            zeitintervall.set_aktivitaetID(aktivitaetID)
            zeitintervall.set_personID(personID)

            result = zeitintervall

        self._cnx.commit()
        cursor.close()
        return result

    def insert(self, zeitintervall):
        """Einfügen eines Zeitintervall-Objekts in die Datenbank.
        Dabei wird auch der Primärschlüssel des übergebenen Objekts geprüft und ggf.
        berichtigt.
        :param zeitintervall das zu speichernde Objekt
        :return das bereits übergebene Objekt, jedoch mit ggf. korrigierter ID.
        """
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

        creation_date = datetime.utcnow()
        command = "INSERT INTO zeitintervall (id, creation_date, datum, startzeit, endzeit, aktivitaetID, personID) VALUES (%s,%s,%s,%s,%s,%s,%s)"
        data = (zeitintervall.get_id(), creation_date, zeitintervall.get_datum(), zeitintervall.get_startzeit(), zeitintervall.get_endzeit(), zeitintervall.get_aktivitaetID(), zeitintervall.get_personID())
        cursor.execute(command, data)

        self._cnx.commit()
        cursor.close()

        return zeitintervall

    def update(self, zeitintervall):
        """Wiederholtes Schreiben eines Objekts in die Datenbank.
        :param zeitintervall das Objekt, das in die DB geschrieben werden soll
        """
        cursor = self._cnx.cursor()

        command = "UPDATE zeitintervall SET datum=%s, startzeit=%s, endzeit=%s, aktivitaetID=%s, personID=%s WHERE id=%s"
        data = (zeitintervall.get_datum(), zeitintervall.get_startzeit(), zeitintervall.get_endzeit(), zeitintervall.get_aktivitaetID(), zeitintervall.get_personID(), zeitintervall.get_id())
        cursor.execute(command, data)

        self._cnx.commit()
        cursor.close()

    def delete(self, id):
        """Löschen der Daten eines Projekt-Objekts aus der Datenbank.
        :param zeitintervall das aus der DB zu löschende "Objekt"
        """
        cursor = self._cnx.cursor()

        command = "DELETE FROM zeitintervall WHERE id={}".format(id)
        cursor.execute(command)

        self._cnx.commit()
        cursor.close()

        return zeitintervall


    # Zum Testen ausführen
if (__name__ == "__main__"):
    with ZeitintervallMapper() as mapper:
        zeitintervall = Zeitintervall()
        zeitintervall.set_id(2)
        zeitintervall.set_creation_date("2022-06-09 00:00:00.0000")
        zeitintervall.set_datum("2022-06-14")
        zeitintervall.set_startzeit("07:00:30")
        zeitintervall.set_endzeit("16:00:00")
        zeitintervall.set_aktivitaetID(1)
        zeitintervall.set_personID(1)

        mapper.insert(zeitintervall)