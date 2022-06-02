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

        for (id, Bezeichnung, Kapazitaet_in_Personentagen, creation_date) in tuples:
            aktivitaet = Aktivitaet()
            aktivitaet.set_id(id)
            aktivitaet.set_bezeichnung(Bezeichnung)
            aktivitaet.set_kapazitaet_in_personentagen(Kapazitaet_in_Personentagen)
            aktivitaet.set_creation_date(creation_date)
            result.append(aktivitaet)

        self._cnx.commit()
        cursor.close()

        return result

    def find_by_key(self, key):
        """Suchen eines Kunden mit vorgegebener Kundennummer. Da diese eindeutig ist,
        wird genau ein Objekt zurückgegeben.

        :param key Primärschlüsselattribut (->DB)
        :return Customer-Objekt, das dem übergebenen Schlüssel entspricht, None bei
            nicht vorhandenem DB-Tupel.
        """
        result = None

        cursor = self._cnx.cursor()
        command = "SELECT * FROM aktivitaet WHERE id={}".format(key)
        cursor.execute(command)
        tuples = cursor.fetchall()

        try:
            (id, Bezeichnung, Kapazität_in_Personentagen, creation_date) = tuples[0]
            aktivitaet = Aktivitaet()
            aktivitaet.set_id(id)
            aktivitaet.set_bezeichnung(Bezeichnung)
            aktivitaet.set_kapazitaet_in_personentagen(Kapazität_in_Personentagen)
            aktivitaet.set_creation_date(creation_date)
            result = aktivitaet
        except IndexError:
            """Der IndexError wird oben beim Zugriff auf tuples[0] auftreten, wenn der vorherige SELECT-Aufruf
            keine Tupel liefert, sondern tuples = cursor.fetchall() eine leere Sequenz zurück gibt."""
            result = None

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
        cursor.execute("SELECT MAX(id) AS maxid FROM aktivitaet")
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

        command = "INSERT INTO aktivitaet (id, Bezeichnung, Kapazität_in_Personentagen, creation_date) VALUES (%s,%s,%s,%s)"
        data = (aktivitaet.get_id(), aktivitaet.get_bezeichnung(), aktivitaet.get_kapazitaet_in_personentagen(),
                aktivitaet.get_creation_date())
        cursor.execute(command, data)

        self._cnx.commit()
        cursor.close()

        return aktivitaet

    def update(self, aktivitaet):
        """Wiederholtes Schreiben eines Objekts in die Datenbank.
        :param aktivitaet das Objekt, das in die DB geschrieben werden soll
        """
        cursor = self._cnx.cursor()

        command = "UPDATE aktivitaet SET Bezeichnung=%s,Kapazität_in_Personentagen=%s, creation_date=%s WHERE id=%s"
        data = (aktivitaet.get_bezeichnung(), aktivitaet.get_kapazitaet_in_personentagen(),
                aktivitaet.get_creation_date(), aktivitaet.get_id())

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



    # Zum Testen ausführen
if (__name__ == "__main__"):
    with AktivitaetMapper() as mapper:
            aktivitaet = Aktivitaet()
            aktivitaet.set_bezeichnung('sff')
            aktivitaet.set_id(2)

            mapper.insert(aktivitaet)