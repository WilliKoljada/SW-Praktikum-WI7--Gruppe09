from server.bo.Aktivität import Aktivität
from server.db.Mapper import Mapper


class AktivitätMapper(Mapper):
    """Mapper-Klasse, die Konversation-Objekte auf eine relationale
    Datenbank abbildet. Hierzu wird eine Reihe von Methoden zur Verfügung
    gestellt, mit deren Hilfe z.B. Objekte gesucht, erzeugt, modifiziert und
    gelöscht werden können.
    """

    def __init__(self):
        super().__init__()

    def find_all(self):
        """Auslesen aller Aktivität.
        :return Eine Sammlung mit Aktivität-Objekten, die sämtliche Aktivität repräsentieren.
        """
        result = []
        cursor = self._cnx.cursor()
        cursor.execute("SELECT * from Aktivität")
        tuples = cursor.fetchall()

        for (id,creation_time, aktivität_id, bezeichnung, kapazität_in_personentagen,) in tuples:
            aktivität= Aktivität()
            aktivität.set_id(id)
            aktivität.set_creation_time(creation_time)
            aktivität.set_aktivität_id(aktivität_id)
            aktivität.set_bezeichnung(bezeichnung)
            aktivität.set_kapazität_in_personentagen(kapazität_in_personentagen)
            result.append(aktivität)

        self._cnx.commit()
        cursor.close()

        return result

    def find_by_key(self, key):
        """Auslesen aller Chats anhand der ID,
        da diese vorgegeben ist, wird genau ein Objekt zurückgegeben.
        :param key Primärschlüsselattribut
        :return Aktivität-Objekt, das dem übergebenen Schlüssel entspricht, None bei
        nicht vorhandenem DB-Tupel
        """
        result = None

        cursor = self._cnx.cursor()
        command = "SELECT * FROM aktivität WHERE id={}".format(key)
        cursor.execute(command)
        tuples = cursor.fetchall()
        for (id, creation_time, aktivität_id, bezeichnung, kapazität_in_personentagen,) in tuples:
            aktivtät = Aktivität()
            aktivität.set_id(id)
            aktivität.set_creation_time(creation_time)
            aktivität.set_bezeichnung(bezeichnung_id)
            aktivität.set_kapazität_in_personentagen(kapazität_in_personentagen)

        result = aktivität

        self._cnx.commit()
        cursor.close()
        return result

    def insert(self, aktivität):
        """Einfügen eines Aktivität-Objekts in die Datenbank.
        Dabei wird auch der Primärschlüssel des übergebenen Objekts geprüft und ggf.
        berichtigt.
        :param aktivität das zu speichernde Objekt
        :return das bereits übergebene Objekt, jedoch mit ggf. korrigierter ID.
        """
        cursor = self._cnx.cursor()
        cursor.execute("SELECT MAX(id) AS maxid FROM aktivität ")
        tuples = cursor.fetchall()

        for (maxid) in tuples:
            if maxid[0] is not None:
                """Wenn wir eine maximale ID festellen konnten, zählen wir diese
                um 1 hoch und weisen diesen Wert als ID dem User-Objekt zu."""
                chat.set_id(maxid[0] + 1)
            else:
                """Wenn wir keine maximale ID feststellen konnten, dann gehen wir
                davon aus, dass die Tabelle leer ist und wir mit der ID 1 beginnen können."""
                aktivität.set_id(1)

        command = "INSERT INTO aktivität (id, creation_time, bezeichnung, kapazität_in_personentagen,) VALUES (%s,%s,%s,%s,%s,%s)"
        data = (
        aktivität.get_id(), aktivität.get_creation_time(), aktivität.get_bezeichnung(), chat.get_kapazität_in_personentagen())
        cursor.execute(command, data)

        self._cnx.commit()
        cursor.close()

        return aktivität

    def update(self, aktivität):
        """Wiederholtes Schreiben eines Objekts in die Datenbank.
        :param aktivität das Objekt, das in die DB geschrieben werden soll
        """
        cursor = self._cnx.cursor()

        command = "UPDATE aktivität SET bezeichnung=%s,kapazität_in_personentagen=%s,WHERE id=%s"
        data = (chat.get_bezeichnung(), chat.get_kapazität_in_personentagen(),chat.get_id())

        cursor.execute(command, data)

        self._cnx.commit()
        cursor.close()

    def delete(self, aktivität):
        """Löschen der Daten eines Projekt-Objekts aus der Datenbank.
        :param aktivität das aus der DB zu löschende "Objekt"
        """
        cursor = self._cnx.cursor()

        command = "DELETE FROM aktivität WHERE id={}".format(aktivität.get_id())
        cursor.execute(command)

        self._cnx.commit()
        cursor.close()

        return aktivität

    def find_by_all_by_aktivität_id(self, aktivität_id):
        result = []

        cursor = self._cnx.cursor()
        command = " SELECT id, creation_time, bezeic, is_accepted,sender, message FROM chat WHERE learngroup_id ={} ORDER BY id".format(
            aktivität_id)
        cursor.execute(command)
        tuples = cursor.fetchall()

        for (id, creation_time, aktivität_id, bezeichnung, kapazität_in_personentagen) in tuples:
            aktivität = Aktivität()
            aktivität.set_id(id)
            aktivität.set_creation_time(creation_time)
            aktivität.set_bezeichnung(bezeichnung)
            aktivität.set_kapazität_in_personentagen(kapazität_in_personentagen)
            result.append(aktivität)

        self._cnx.commit()
        cursor.close()

        return result

    # Zum Testen ausführen
    if (__name__ == "__main__"):
        with AktivitätMapper() as mapper:
            aktivität = aktivität()
            aktivität.set_name("Mathe Chat")
            aktivität.set_id(2)

            mapper.insert(aktivität)