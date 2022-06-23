from server.bo.Ereignis import Ereignis
from server.db.Mapper import Mapper
from datetime import datetime


class EreignisMapper(Mapper):
    """Mapper-Klasse, die Konversation-Objekte auf eine relationale
    Datenbank abbildet. Hierzu wird eine Reihe von Methoden zur Verfügung
    gestellt, mit deren Hilfe z.B. Objekte gesucht, erzeugt, modifiziert und
    gelöscht werden können.
    """

    def __init__(self):
        super().__init__()

    def find_all(self):
        """Auslesen aller Ereignis.
        :return Eine Sammlung mit Ereignis-Objekten, die sämtliche Ereignis repräsentieren.
        """
        result = []
        cursor = self._cnx.cursor()
        cursor.execute("SELECT id, creation_date, type, datum, startzeit, endzeit, personID from ereignis")
        tuples = cursor.fetchall()

        for (id, creation_date, type, datum, startzeit, endzeit, personID) in tuples:
            ereignis= Ereignis()
            ereignis.set_id(id)
            ereignis.set_creation_date(creation_date)
            ereignis.set_type(type)
            ereignis.set_datum(datum)
            ereignis.set_startzeit(startzeit)
            ereignis.set_endzeit(endzeit)
            ereignis.set_personID(personID)
            result.append(ereignis)

        self._cnx.commit()
        cursor.close()

        return result

    def find_by_key(self, key):
        """Auslesen aller Ereignis anhand der ID,
        da diese vorgegeben ist, wird genau ein Objekt zurückgegeben.
        :param key Primärschlüsselattribut
        :return Ereignis-Objekt, das dem übergebenen Schlüssel entspricht, None bei
        nicht vorhandenem DB-Tupel
        """
        result = None

        cursor = self._cnx.cursor()
        command = "SELECT id, creation_date, type, datum, startzeit, endzeit, personID FROM ereignis WHERE id={}".format(key)
        cursor.execute(command)
        tuples = cursor.fetchall()
        for (id, creation_date, type, datum, startzeit, endzeit, personID) in tuples:
            ereignis= Ereignis()
            ereignis.set_id(id)
            ereignis.set_creation_date(creation_date)
            ereignis.set_type(type)
            ereignis.set_datum(datum)
            ereignis.set_startzeit(startzeit)
            ereignis.set_endzeit(endzeit)
            ereignis.set_personID(personID)

            result = ereignis

        self._cnx.commit()
        cursor.close()
        return result

    def find_by_type(self, value):
        """Auslesen aller Ereignis anhand der type,
        da diese vorgegeben ist, wird genau ein Objekt zurückgegeben.
        :param key Primärschlüsselattribut
        :return Ereignis-Objekt, das dem übergebenen Schlüssel entspricht, None bei
        nicht vorhandenem DB-Tupel
        """
        result = None

        cursor = self._cnx.cursor()
        command = "SELECT id, creation_date, type, datum, startzeit, endzeit, personID FROM ereignis WHERE type LIKE '{}'".format(value)
        cursor.execute(command)
        tuples = cursor.fetchall()
        for (id, creation_date, type, datum, startzeit, endzeit, personID) in tuples:
            ereignis= Ereignis()
            ereignis.set_id(id)
            ereignis.set_creation_date(creation_date)
            ereignis.set_type(type)
            ereignis.set_datum(datum)
            ereignis.set_startzeit(startzeit)
            ereignis.set_endzeit(endzeit)
            ereignis.set_personID(personID)

            result = ereignis

        self._cnx.commit()
        cursor.close()
        return result

    def find_by_personID(self, personID):
        """Auslesen aller Ereignis anhand der type,
        da diese vorgegeben ist, wird genau ein Objekt zurückgegeben.
        :param key Primärschlüsselattribut
        :return Ereignis-Objekt, das dem übergebenen Schlüssel entspricht, None bei
        nicht vorhandenem DB-Tupel
        """
        result = None

        cursor = self._cnx.cursor()
        command = "SELECT id, creation_date, type, datum, startzeit, endzeit, personID FROM ereignis WHERE personID={}".format(personID)
        cursor.execute(command)
        tuples = cursor.fetchall()
        for (id, creation_date, type, datum, startzeit, endzeit, personID) in tuples:
            ereignis= Ereignis()
            ereignis.set_id(id)
            ereignis.set_creation_date(creation_date)
            ereignis.set_type(type)
            ereignis.set_datum(datum)
            ereignis.set_startzeit(startzeit)
            ereignis.set_endzeit(endzeit)
            ereignis.set_personID(personID)

            result = ereignis

        self._cnx.commit()
        cursor.close()
        return result

    def insert(self, ereignis):
        """Einfügen eines Ereignis-Objekts in die Datenbank.
        Dabei wird auch der Primärschlüssel des übergebenen Objekts geprüft und ggf.
        berichtigt.
        :param ereignis das zu speichernde Objekt
        :return das bereits übergebene Objekt, jedoch mit ggf. korrigierter ID.
        """
        cursor = self._cnx.cursor()
        cursor.execute("SELECT MAX(id) AS maxid FROM ereignis ")
        tuples = cursor.fetchall()

        for (maxid) in tuples:
            if maxid[0] is not None:
                """Wenn wir eine maximale ID festellen konnten, zählen wir diese
                um 1 hoch und weisen diesen Wert als ID dem User-Objekt zu."""
                ereignis.set_id(maxid[0] + 1)
            else:
                """Wenn wir keine maximale ID feststellen konnten, dann gehen wir
                davon aus, dass die Tabelle leer ist und wir mit der ID 1 beginnen können."""
                ereignis.set_id(1)

        creation_date = datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%S")
        ereignis.set_creation_date(creation_date)
        command = "INSERT INTO ereignis (id, creation_date, type, datum, startzeit, endzeit, personID) VALUES (%s,%s,%s,%s,%s,%s,%s)"
        data = (ereignis.get_id(), creation_date, ereignis.get_type(), ereignis.get_datum(), ereignis.get_startzeit(), ereignis.get_endzeit(), ereignis.get_personID())
        cursor.execute(command, data)

        self._cnx.commit()
        cursor.close()

        return ereignis

    def update(self, ereignis):
        """Wiederholtes Schreiben eines Objekts in die Datenbank.
        :param ereignis das Objekt, das in die DB geschrieben werden soll
        """
        cursor = self._cnx.cursor()

        command = "UPDATE ereignis SET type=%s, datum=%s, startzeit=%s, endzeit=%s, personID=%s WHERE id=%s"
        data = (ereignis.get_type(), ereignis.get_datum(), ereignis.get_startzeit(), ereignis.get_endzeit(), ereignis.get_personID(), ereignis.get_id())
        cursor.execute(command, data)

        self._cnx.commit()
        cursor.close()

    def delete(self, id):
        """Löschen der Daten eines Projekt-Objekts aus der Datenbank.
        :param ereignis das aus der DB zu löschende "Objekt"
        """
        cursor = self._cnx.cursor()
        ereignis = self.find_by_key(id)

        command = "DELETE FROM ereignis WHERE id={}".format(id)
        cursor.execute(command)
        self._cnx.commit()
        cursor.close()

        return ereignis


    # Zum Testen ausführen
if (__name__ == "__main__"):
    with EreignisMapper() as mapper:
        ereignis = Ereignis()
        ereignis.set_id(12)
        ereignis.set_creation_date("2022-06-20 00:00:00.0000")
        ereignis.set_type("Urlaub")
        ereignis.set_datum("2022-06-13")
        ereignis.set_startzeit("07:30:00")
        ereignis.set_endzeit("16:00:00")
        ereignis.set_personID(1)
        mapper.insert(ereignis)