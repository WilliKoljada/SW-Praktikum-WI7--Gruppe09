from src.server.bo.Buchung import Buchung
from src.server.db.Mapper import Mapper


class BuchungMapper(Mapper):
    """Mapper-Klasse, die Konversation-Objekte auf eine relationale
    Datenbank abbildet. Hierzu wird eine Reihe von Methoden zur Verfügung
    gestellt, mit deren Hilfe z.B. Objekte gesucht, erzeugt, modifiziert und
    gelöscht werden können.
    """

    def __init__(self):
        super().__init__()

    def find_all(self):
        """Auslesen aller Buchung.
        :return Eine Sammlung mit Buchung-Objekten, die sämtliche Buchung repräsentieren.
        """
        result = []
        cursor = self._cnx.cursor()
        cursor.execute("SELECT * from buchung")
        tuples = cursor.fetchall()

        for (id,creation_time, buchungs_id) in tuples:
            buchung = Buchung()
            buchung.set_id(id)
            buchung.set_creation_time(creation_time)
            buchung.set_buchungs_id(buchungs_id)
            result.append(buchung)

        self._cnx.commit()
        cursor.close()

        return result

    def find_by_key(self, key):
        """Auslesen aller Buchung anhand der ID,
        da diese vorgegeben ist, wird genau ein Objekt zurückgegeben.
        :param key Primärschlüsselattribut
        :return Buchung-Objekt, das dem übergebenen Schlüssel entspricht, None bei
        nicht vorhandenem DB-Tupel
        """
        result = None

        cursor = self._cnx.cursor()
        command = "SELECT * FROM buchung WHERE id={}".format(key)
        cursor.execute(command)
        tuples = cursor.fetchall()
        for (id, creation_time) in tuples:
            buchung = Buchung()
            buchung.set_id(id)
            buchung.set_creation_time(creation_time)

        result = buchung

        self._cnx.commit()
        cursor.close()
        return result

    def insert(self, buchung):
        """Einfügen eines Buchung-Objekts in die Datenbank.
        Dabei wird auch der Primärschlüssel des übergebenen Objekts geprüft und ggf.
        berichtigt.
        :param buchung das zu speichernde Objekt
        :return das bereits übergebene Objekt, jedoch mit ggf. korrigierter ID.
        """
        cursor = self._cnx.cursor()
        cursor.execute("SELECT MAX(id) AS maxid FROM buchung ")
        tuples = cursor.fetchall()

        for (maxid) in tuples:
            if maxid[0] is not None:
                """Wenn wir eine maximale ID festellen konnten, zählen wir diese
                um 1 hoch und weisen diesen Wert als ID dem User-Objekt zu."""
                chat.set_id(maxid[0] + 1)
            else:
                """Wenn wir keine maximale ID feststellen konnten, dann gehen wir
                davon aus, dass die Tabelle leer ist und wir mit der ID 1 beginnen können."""
                buchung.set_id(1)

        command = "INSERT INTO buchung (id, creation_time) VALUES (%s,%s,%s,%s,%s,%s)"
        data = (
        buchung.get_id(), buchung.get_creation_time())
        cursor.execute(command, data)

        self._cnx.commit()
        cursor.close()
        return buchung

    def update(self, buchung):
        """Wiederholtes Schreiben eines Objekts in die Datenbank.
        :param Buchung das Objekt, das in die DB geschrieben werden soll
        """
        cursor = self._cnx.cursor()

        command = "UPDATE buchung SET WHERE id=%s,creation_time=%s"
        data = (buchung.get_id(), buchung.get_creation_time())

        cursor.execute(command, data)

        self._cnx.commit()
        cursor.close()

    def delete(self, buchung):
        """Löschen der Daten eines Projekt-Objekts aus der Datenbank.
        :param Buchung das aus der DB zu löschende "Objekt"
        """
        cursor = self._cnx.cursor()

        command = "DELETE FROM buchung WHERE id={}".format(buchung.get_id())
        cursor.execute(command)

        self._cnx.commit()
        cursor.close()

        return buchung



    def find_by_bezeichnung(self, bezeichnung):

        result = []
        cursor = self._cnx.cursor()
        command = "SELECT id, creation_time FROM Buchung WHERE bezeichnung={}".format(bezeichnung)

        cursor.execute(command)
        tuples = cursor.fetchall()

        for (id, creation_time) in tuples:
            buchung = Buchung()
            buchung.set_id(id)
            buchung.set_creation_time(creation_time)
            result.append(buchung)

        self._cnx.commit()
        cursor.close()

        return result

    # Zum Testen ausführen
    if (__name__ == "__main__"):
        with BuchungMapper() as mapper:
            buchung = Buchung()
            buchung.set_name("Mathe Chat")
            buchung.set_id(2)

            mapper.insert(buchung)
