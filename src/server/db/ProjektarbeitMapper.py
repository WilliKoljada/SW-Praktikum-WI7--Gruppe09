from src.server.bo.Projektarbeit import Projektarbeit
from src.server.db.Mapper import Mapper


class ProjektarbeitMapper(Mapper):
    """Mapper-Klasse, die Konversation-Objekte auf eine relationale
    Datenbank abbildet. Hierzu wird eine Reihe von Methoden zur Verfügung
    gestellt, mit deren Hilfe z.B. Objekte gesucht, erzeugt, modifiziert und
    gelöscht werden können.
    """

    def __init__(self):
        super().__init__()

    def find_all(self):
        """Auslesen aller Projektarbeit.
        :return Eine Sammlung mit Projektarbeit-Objekten, die sämtliche Projektarbeit repräsentieren.
        """
        result = []
        cursor = self._cnx.cursor()
        cursor.execute("SELECT * from Projektarbeit")
        tuples = cursor.fetchall()

        for (id, bezeichnung) in tuples:
            projektarbeit= Projektarbeit()
            projektarbeit.set_id(id)
            projektarbeit.set_bezeichnung(bezeichnung)
            result.append(projektarbeit)

        self._cnx.commit()
        cursor.close()

        return result

    def find_by_key(self, key):
        """Auslesen aller Projektarbeit anhand der ID,
        da diese vorgegeben ist, wird genau ein Objekt zurückgegeben.
        :param key Primärschlüsselattribut
        :return Projektarbeit-Objekt, das dem übergebenen Schlüssel entspricht, None bei
        nicht vorhandenem DB-Tupel
        """
        result = None

        cursor = self._cnx.cursor()
        command = "SELECT * FROM projektarbeit WHERE id={}".format(key)
        cursor.execute(command)
        tuples = cursor.fetchall()
        for (id, bezeichnung) in tuples:
            projektarbeit = Projektarbeit()
            projektarbeit.set_id(id)
            projektarbeit.set_bezeichnung(bezeichnung)

        result = projektarbeit

        self._cnx.commit()
        cursor.close()
        return result

    def insert(self, projektarbeit):
        """Einfügen eines Projektarbeit-Objekts in die Datenbank.
        Dabei wird auch der Primärschlüssel des übergebenen Objekts geprüft und ggf.
        berichtigt.
        :param projektarbeit das zu speichernde Objekt
        :return das bereits übergebene Objekt, jedoch mit ggf. korrigierter ID.
        """
        cursor = self._cnx.cursor()
        cursor.execute("SELECT MAX(id) AS maxid FROM projektarbeit ")
        tuples = cursor.fetchall()

        for (maxid) in tuples:
            if maxid[0] is not None:
                """Wenn wir eine maximale ID festellen konnten, zählen wir diese
                um 1 hoch und weisen diesen Wert als ID dem User-Objekt zu."""
                projektarbeit.set_id(maxid[0] + 1)
            else:
                """Wenn wir keine maximale ID feststellen konnten, dann gehen wir
                davon aus, dass die Tabelle leer ist und wir mit der ID 1 beginnen können."""
                projektarbeit.set_id(1)

        command = "INSERT INTO projektarbeit (id, bezeichnung) VALUES (%s,%s,%s,%s,%s,%s)"
        data = (
        projektarbeit.get_id(), projektarbeit.get_bezeichnung())
        cursor.execute(command, data)

        self._cnx.commit()
        cursor.close()

        return projektarbeit

    def update(self, projektarbeit):
        """Wiederholtes Schreiben eines Objekts in die Datenbank.
        :param projektarbeit das Objekt, das in die DB geschrieben werden soll
        """
        cursor = self._cnx.cursor()

        command = "UPDATE projektarbeit SET bezeichnung=%s WHERE id=%s"
        data = (projektarbeit.get_bezeichnung(), projektarbeit.get_id())

        cursor.execute(command, data)

        self._cnx.commit()
        cursor.close()

    def delete(self, projektarbeit):
        """Löschen der Daten eines Projektarbeit-Objekts aus der Datenbank.
        :param projektarbeit das aus der DB zu löschende "Objekt"
        """
        cursor = self._cnx.cursor()

        command = "DELETE FROM projektarbeit WHERE id={}".format(projektarbeit.get_id())
        cursor.execute(command)

        self._cnx.commit()
        cursor.close()

        return projektarbeit



    def find_by_bezeichnung(self, bezeichnung):

        result = []
        cursor = self._cnx.cursor()
        command = "SELECT id, bezeichnung FROM projektarbeit WHERE bezeichnung={}".format(bezeichnung)

        cursor.execute(command)
        tuples = cursor.fetchall()

        for (id, bezeichnung) in tuples:
            projektarbeit = Projektarbeit()
            projektarbeit.set_id(id)
            projektarbeit.set_bezeichnung(bezeichnung)
            result.append(projektarbeit)

        self._cnx.commit()
        cursor.close()

        return result

    # Zum Testen ausführen
if (__name__ == "__main__"):
    with ProjektarbeitMapper() as mapper:
            projektarbeit = Projektarbeit()
            projektarbeit.set_name("Mathe Chat")
            projektarbeit.set_id(2)

            mapper.insert(projektarbeit)