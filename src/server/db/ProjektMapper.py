from server.bo.Projekt import Projekt
from src.server.db.Mapper import Mapper


class ProjektMapper(Mapper):
    """Mapper-Klasse, die Konversation-Objekte auf eine relationale
    Datenbank abbildet. Hierzu wird eine Reihe von Methoden zur Verfügung
    gestellt, mit deren Hilfe z.B. Objekte gesucht, erzeugt, modifiziert und
    gelöscht werden können.
    """

    def __init__(self):
        super().__init__()

    def find_all(self):
        """Auslesen aller Projekt.
        :return Eine Sammlung mit Projekt-Objekten, die sämtliche Projekt repräsentieren.
        """
        result = []
        cursor = self._cnx.cursor()
        cursor.execute("SELECT * from projekt")
        tuples = cursor.fetchall()

        for (id,creation_date, auftraggeber, bezeichnung) in tuples:
            projekt= Projekt()
            projekt.set_id(id)
            projekt.set_creation_date(creation_date)
            projekt.set_auftraggeber(auftraggeber)
            projekt.set_bezeichnung(bezeichnung)
            result.append(projekt)

        self._cnx.commit()
        cursor.close()

        return result

    def find_by_key(self, key):
        """Auslesen aller Projekt anhand der ID,
        da diese vorgegeben ist, wird genau ein Objekt zurückgegeben.
        :param key Primärschlüsselattribut
        :return Projekt-Objekt, das dem übergebenen Schlüssel entspricht, None bei
        nicht vorhandenem DB-Tupel
        """
        result = None

        cursor = self._cnx.cursor()
        command = "SELECT * FROM projekt WHERE id={}".format(key)
        cursor.execute(command)
        tuples = cursor.fetchall()
        for (id, creation_date, auftraggeber, bezeichnung) in tuples:
            projekt = Projekt()
            projekt.set_id(id)
            projekt.set_creation_date(creation_date)
            projekt.set_auftraggeber(auftraggeber)
            projekt.set_bezeichnung(bezeichnung)

            result = projekt

        self._cnx.commit()
        cursor.close()
        return result

    def find_by_bezeichnung(self, bezeichnung):

        result = []
        cursor = self._cnx.cursor()
        command = "SELECT id, creation_date, Auftraggeber, Bezeichnung FROM projekt WHERE Bezeichnung={}".format(
            bezeichnung)

        cursor.execute(command)
        tuples = cursor.fetchall()

        for (id, Bezeichnung, Auftraggeber, creation_date) in tuples:
            projekt = Projekt()
            projekt.set_id(id)
            projekt.set_bezeichnung(Bezeichnung)
            projekt.set_auftraggeber(Auftraggeber)
            projekt.set_creation_date(creation_date)
            result.append(projekt)

        self._cnx.commit()
        cursor.close()

        return result

    def insert(self, projekt):
        """Einfügen eines Projekt-Objekts in die Datenbank.
        Dabei wird auch der Primärschlüssel des übergebenen Objekts geprüft und ggf.
        berichtigt.
        :param projekt das zu speichernde Objekt
        :return das bereits übergebene Objekt, jedoch mit ggf. korrigierter ID.
        """
        cursor = self._cnx.cursor()
        cursor.execute("SELECT MAX(id) AS maxid FROM projekt ")
        tuples = cursor.fetchall()

        for (maxid) in tuples:
            if maxid[0] is not None:
                """Wenn wir eine maximale ID festellen konnten, zählen wir diese
                um 1 hoch und weisen diesen Wert als ID dem User-Objekt zu."""
                projekt.set_id(maxid[0] + 1)
            else:
                """Wenn wir keine maximale ID feststellen konnten, dann gehen wir
                davon aus, dass die Tabelle leer ist und wir mit der ID 1 beginnen können."""
                projekt.set_id(1)

        command = "INSERT INTO projekt (id, Bezeichnung, Auftraggeber, creation_date) VALUES (%s,%s,%s,%s)"
        data = (projekt.get_id(), projekt.get_bezeichnung(), projekt.get_auftraggeber(), projekt.get_creation_date())

        cursor.execute(command, data)

        self._cnx.commit()
        cursor.close()

        return projekt

    def update(self, projekt):
        """Wiederholtes Schreiben eines Objekts in die Datenbank.
        :param projekt das Objekt, das in die DB geschrieben werden soll
        """
        cursor = self._cnx.cursor()

        command = "UPDATE projekt SET Auftraggeber=%s, Bezeichnung=%s, creation_date=%s, WHERE id=%s"
        data = (projekt.get_auftraggeber(), projekt.get_bezeichnung(), projekt.get_creation_date(), projekt.get_id())

        cursor.execute(command, data)

        self._cnx.commit()
        cursor.close()

    def delete(self, projekt):
        """Löschen der Daten eines Projekt-Objekts aus der Datenbank.
        :param projekt das aus der DB zu löschende "Objekt"
        """
        cursor = self._cnx.cursor()

        command = "DELETE FROM projekt WHERE id={}".format(projekt.get_id())
        cursor.execute(command)

        self._cnx.commit()
        cursor.close()

        return projekt


    # Zum Testen ausführen
if (__name__ == "__main__"):
    with ProjektMapper() as mapper:
            projekt = Projekt()
            projekt.set_bezeichnung("madrid")
            projekt.set_auftraggeber('Real')

            mapper.insert(projekt)