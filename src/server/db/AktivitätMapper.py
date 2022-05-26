from src.server.bo.Aktivitaet import Aktivitaet
from src.server.db.Mapper import Mapper


class AktivitaetMapper(Mapper):
    """Mapper-Klasse, die Konversation-Objekte auf eine relationale
    Datenbank abbildet. Hierzu wird eine Reihe von Methoden zur Verfügung
    gestellt, mit deren Hilfe z.B. Objekte gesucht, erzeugt, modifiziert und
    gelöscht werden können.
    """

    def __init__(self):
        super().__init__()

    def find_all(self):
        """Auslesen aller Aktivitaet.
        :return Eine Sammlung mit Aktivitaet-Objekten, die sämtliche Aktivitaet repräsentieren.
        """
        result = []
        cursor = self._cnx.cursor()
        cursor.execute("SELECT * from aktivitaet")
        tuples = cursor.fetchall()

        for (id,creation_time,bezeichnung, kapazitaet_in_personentagen,) in tuples:
            aktivitaet= Aktivitaet()
            aktivitaet.set_id(id)
            aktivitaet.set_creation_time(creation_time)
            aktivitaet.set_bezeichnung(bezeichnung)
            aktivitaet.set_kapazitaet_in_personentagen(kapazitaet_in_personentagen)
            result.append(aktivitaet)

        self._cnx.commit()
        cursor.close()

        return result

    def find_by_key(self, key):
        """Auslesen aller Aktivitaet anhand der ID,
        da diese vorgegeben ist, wird genau ein Objekt zurückgegeben.
        :param key Primärschlüsselattribut
        :return Aktivitaet-Objekt, das dem übergebenen Schlüssel entspricht, None bei
        nicht vorhandenem DB-Tupel
        """
        result = None

        cursor = self._cnx.cursor()
        command = "SELECT * FROM aktivitaet WHERE id={}".format(key)
        cursor.execute(command)
        tuples = cursor.fetchall()
        for (id, creation_time, bezeichnung, kapazitaet_in_personentagen) in tuples:
            aktivitaet = Aktivitaet()
            aktivitaet.set_id(id)
            aktivitaet.set_creation_time(creation_time)
            aktivitaet.set_bezeichnung(bezeichnung)
            aktivitaet.set_kapazitaet_in_personentagen(kapazitaet_in_personentagen)

        result = aktivitaet

        self._cnx.commit()
        cursor.close()
        return result

    def insert(self, aktivitaet):
        """Einfügen eines Aktivitaet-Objekts in die Datenbank.
        Dabei wird auch der Primärschlüssel des übergebenen Objekts geprüft und ggf.
        berichtigt.
        :param aktivitaet das zu speichernde Objekt
        :return das bereits übergebene Objekt, jedoch mit ggf. korrigierter ID.
        """
        cursor = self._cnx.cursor()
        cursor.execute("SELECT MAX(id) AS maxid FROM aktivitaet ")
        tuples = cursor.fetchall()

        for (maxid) in tuples:
            if maxid[0] is not None:
                """Wenn wir eine maximale ID festellen konnten, zählen wir diese
                um 1 hoch und weisen diesen Wert als ID dem User-Objekt zu."""
                aktivitaet.set_id(maxid[0] + 1)
            else:
                """Wenn wir keine maximale ID feststellen konnten, dann gehen wir
                davon aus, dass die Tabelle leer ist und wir mit der ID 1 beginnen können."""
                aktivitaet.set_id(1)

        command = "INSERT INTO aktivitaet (id, creation_time, bezeichnung, kapazitaet_in_personentagen,) VALUES (%s,%s,%s,%s,%s,%s)"
        data = (
        aktivitaet.get_id(), aktivitaet.get_creation_time(), aktivitaet.get_bezeichnung(), aktivitaet.get_kapazitaet_in_personentagen())
        cursor.execute(command, data)

        self._cnx.commit()
        cursor.close()

        return aktivitaet

    def update(self, aktivitaet):
        """Wiederholtes Schreiben eines Objekts in die Datenbank.
        :param aktivitaet das Objekt, das in die DB geschrieben werden soll
        """
        cursor = self._cnx.cursor()

        command = "UPDATE aktivitaet SET bezeichnung=%s,kapazitaet_in_personentagen=%s,WHERE id=%s"
        data = (aktivitaet.get_bezeichnung(), aktivitaet.get_kapazitaet_in_personentagen(),aktivitaeti.get_id())

        cursor.execute(command, data)

        self._cnx.commit()
        cursor.close()

    def delete(self, aktivitaet):
        """Löschen der Daten eines Projekt-Objekts aus der Datenbank.
        :param aktivitaet das aus der DB zu löschende "Objekt"
        """
        cursor = self._cnx.cursor()

        command = "DELETE FROM aktivitaet WHERE id={}".format(aktivitaet.get_id())
        cursor.execute(command)

        self._cnx.commit()
        cursor.close()

        return aktivitaet



    def find_by_id(self, id):

        result = []
        cursor = self._cnx.cursor()
        command = "SELECT id, creation_time, bezeichnung, kapazitaet_in_personentagen FROM aktivitaet WHERE bezeichnung={}".format(bezeichnung)

        cursor.execute(command)
        tuples = cursor.fetchall()

        for (id, creation_time, bezeichnung, kapazitaet_in_personentagen) in tuples:
            aktivitaet = Aktivitaet()
            aktivitaet.set_id(id)
            aktivitaet.set_creation_time(creation_time)
            aktivitaet.set_bezeichnung(bezeichnung)
            aktivitaet.set_kapazitaet_in_personentagen(kapazitaet_in_personentagen)
            result.append(aktivitaet)

        self._cnx.commit()
        cursor.close()

        return result

    # Zum Testen ausführen
    if (__name__ == "__main__"):
        with AktivitaetMapper() as mapper:
            aktivitaet = Aktivitaet()
            aktivitaet.set_name("Mathe Chat")
            aktivitaet.set_id(2)

            mapper.insert(aktivitaet)