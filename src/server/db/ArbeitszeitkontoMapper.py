from src.server.bo.Arbeitszeitkonto import Arbeitszeitkonto
from src.server.db.Mapper import Mapper


class ArbeitszeitkontoMapper(Mapper):
    """Mapper-Klasse, die Konversation-Objekte auf eine relationale
    Datenbank abbildet. Hierzu wird eine Reihe von Methoden zur Verfügung
    gestellt, mit deren Hilfe z.B. Objekte gesucht, erzeugt, modifiziert und
    gelöscht werden können.
    """

    def __init__(self):
        super().__init__()

    def find_all(self):
        """Auslesen aller Arbeitszeitkonto.
        :return Eine Sammlung mit Arbeitszeitkonto-Objekten, die sämtliche Arbeitszeitkonto repräsentieren.
        """
        result = []
        cursor = self._cnx.cursor()
        cursor.execute("SELECT * from arbeitszeitkonto")
        tuples = cursor.fetchall()

        for (id,creation_time) in tuples:
            arbeitszeitkonto= Arbeitszeitkonto()
            arbeitszeitkonto.set_id(id)
            arbeitszeitkonto.set_creation_time(creation_time)
            result.append(arbeitszeitkonto)

        self._cnx.commit()
        cursor.close()

        return result

    def find_by_key(self, key):
        """Auslesen aller Arbeitszeitkonto anhand der ID,
        da diese vorgegeben ist, wird genau ein Objekt zurückgegeben.
        :param key Primärschlüsselattribut
        :return Arbeitszeitkonto-Objekt, das dem übergebenen Schlüssel entspricht, None bei
        nicht vorhandenem DB-Tupel
        """
        result = None

        cursor = self._cnx.cursor()
        command = "SELECT * FROM arbeitszeitkonto WHERE id={}".format(key)
        cursor.execute(command)
        tuples = cursor.fetchall()
        for (id, creation_time) in tuples:
            arbeitszeitkonto = Arbeitszeitkonto()
            arbeitszeitkonto.set_id(id)
            arbeitszeitkonto.set_creation_time(creation_time)

        result = arbeitszeitkonto

        self._cnx.commit()
        cursor.close()
        return result

    def insert(self, arbeitszeitkonto):
        """Einfügen eines Arbeitszeitkonto-Objekts in die Datenbank.
        Dabei wird auch der Primärschlüssel des übergebenen Objekts geprüft und ggf.
        berichtigt.
        :param arbeitszeitkonto das zu speichernde Objekt
        :return das bereits übergebene Objekt, jedoch mit ggf. korrigierter ID.
        """
        cursor = self._cnx.cursor()
        cursor.execute("SELECT MAX(id) AS maxid FROM arbeitszeitkonto ")
        tuples = cursor.fetchall()

        for (maxid) in tuples:
            if maxid[0] is not None:
                """Wenn wir eine maximale ID festellen konnten, zählen wir diese
                um 1 hoch und weisen diesen Wert als ID dem User-Objekt zu."""
                chat.set_id(maxid[0] + 1)
            else:
                """Wenn wir keine maximale ID feststellen konnten, dann gehen wir
                davon aus, dass die Tabelle leer ist und wir mit der ID 1 beginnen können."""
                arbeitszeitkonto.set_id(1)

        command = "INSERT INTO arbeitszeitkonto (id, creation_time) VALUES (%s,%s,%s,%s,%s,%s)"
        data = (
        arbeitszeitkonto.get_id(), arbeitszeitkonto.get_creation_time())
        cursor.execute(command, data)

        self._cnx.commit()
        cursor.close()
        return arbeitszeitkonto

    def update(self, arbeitszeitkonto):
        """Wiederholtes Schreiben eines Objekts in die Datenbank.
        :param Arbeitszeitkonto das Objekt, das in die DB geschrieben werden soll
        """
        cursor = self._cnx.cursor()

        command = "UPDATE arbeitszeitkonto SET WHERE id=%s,creation_time=%s"
        data = (arbeitszeitkonto.get_id(), arbeitszeitkonto.get_creation_time())

        cursor.execute(command, data)

        self._cnx.commit()
        cursor.close()

    def delete(self, arbeitszeitkonto):
        """Löschen der Daten eines Projekt-Objekts aus der Datenbank.
        :param Arbeitszeitkonto das aus der DB zu löschende "Objekt"
        """
        cursor = self._cnx.cursor()

        command = "DELETE FROM arbeitszeitkonto WHERE id={}".format(arbeitszeitkonto.get_id())
        cursor.execute(command)

        self._cnx.commit()
        cursor.close()

        return arbeitszeitkonto



    def find_by_bezeichnung(self, bezeichnung):

        result = []
        cursor = self._cnx.cursor()
        command = "SELECT id, creation_time FROM Arbeitszeitkonto WHERE bezeichnung={}".format(bezeichnung)

        cursor.execute(command)
        tuples = cursor.fetchall()

        for (id, creation_time) in tuples:
            arbeitszeitkonto = Arbeitszeitkonto()
            arbeitszeitkonto.set_id(id)
            arbeitszeitkonto.set_creation_time(creation_time)
            result.append(arbeitszeitkonto)

        self._cnx.commit()
        cursor.close()

        return result

    # Zum Testen ausführen
if (__name__ == "__main__"):
    with ArbeitszeitkontoMapper() as mapper:
            arbeitszeitkonto = Arbeitszeitkonto()
            arbeitszeitkonto.set_name("Mathe Chat")
            arbeitszeitkonto.set_id(2)

            mapper.insert(arbeitszeitkonto)
