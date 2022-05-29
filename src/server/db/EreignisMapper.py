from src.server.bo.Ereignis import Ereignis
from src.server.db.Mapper import Mapper


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
        cursor.execute("SELECT * from Ereignis")
        tuples = cursor.fetchall()

        for (id,creation_time, zeitpunkt_ereigniseintritt) in tuples:
            ereignis= Ereignis()
            ereignis.set_id(id)
            ereignis.set_creation_time(creation_time)
            ereignis.set_zeitpunkt_ereigniseintritt(zeitpunkt_ereigniseintritt)
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
        command = "SELECT * FROM ereignis WHERE id={}".format(key)
        cursor.execute(command)
        tuples = cursor.fetchall()
        for (id, creation_time, zeitpunkt_ereigniseintritt) in tuples:
            ereignis = Ereignis()
            ereignis.set_id(id)
            ereignis.set_creation_time(creation_time)
            ereignis.set_zeitpunkt_ereigniseintritt(zeitpunkt_ereigniseintritt)

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

        command = "INSERT INTO ereignis (id, creation_date, zeitpunkt_ereigniseintritt) VALUES (%s,%s,%s)"
        data = (
        ereignis.get_id(), ereignis.get_creation_date(), ereignis.get_zeitpunkt_ereigniseintritt())
        cursor.execute(command, data)

        self._cnx.commit()
        cursor.close()

        return ereignis

    def update(self, ereignis):
        """Wiederholtes Schreiben eines Objekts in die Datenbank.
        :param ereignis das Objekt, das in die DB geschrieben werden soll
        """
        cursor = self._cnx.cursor()

        command = "UPDATE ereignis SET zeitpunkt_ereigniseintritt=%s,WHERE id=%s"
        data = (ereignis.get_zeitpunkt_ereigniseintritt(), ereignis.get_id())

        cursor.execute(command, data)

        self._cnx.commit()
        cursor.close()

    def delete(self, ereignis):
        """Löschen der Daten eines Projekt-Objekts aus der Datenbank.
        :param ereignis das aus der DB zu löschende "Objekt"
        """
        cursor = self._cnx.cursor()

        command = "DELETE FROM ereignis WHERE id={}".format(ereignis.get_id())
        cursor.execute(command)

        self._cnx.commit()
        cursor.close()

        return ereignis



    def find_by_bezeichnung(self, bezeichnung):

        result = []
        cursor = self._cnx.cursor()
        command = "SELECT id, creation_date, zeitpunkt_ereigniseintritt FROM ereignis WHERE bezeichnung={}".format(bezeichnung)

        cursor.execute(command)
        tuples = cursor.fetchall()

        for (id, creation_time, zeitpunkt_ereigniseintritt) in tuples:
            ereignis = Ereignis()
            ereignis.set_id(id)
            ereignis.set_creation_time(creation_time)
            ereignis.set_zeitpunkt_ereigniseintritt(zeitpunkt_ereigniseintritt)
            result.append(ereignis)

        self._cnx.commit()
        cursor.close()

        return result

    # Zum Testen ausführen
if (__name__ == "__main__"):
    with EreignisMapper() as mapper:
            ereignis = Ereignis()
            ereignis.set_zeitpunkt_ereigniseintritt("Mathe Chat")

            mapper.insert(ereignis)