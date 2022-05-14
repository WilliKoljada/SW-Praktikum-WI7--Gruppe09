from src.server.bo import BusinessObject as bo


# User Klasse
class Zeitintervall (bo.BusinessObject):

    def __init__(self):
        super().__init__()
        self._zeitintervall_id = 0
        self._projektlaufzeit = ""


    def get_zeitintervall_id(self):
        return self._zeitintervall_id

    def set_zeitintervall_id(self, value):
        self._zeitintervall_id = value

    def get_projektlaufzeit(self):
        return self._projektlaufzeit

    def set_projektlaufzeit(self, value):
        self._projektlaufzeit = value