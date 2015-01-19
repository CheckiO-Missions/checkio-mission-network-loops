"""
CheckiOReferee is a base referee for checking you code.
    arguments:
        tests -- the dict contains tests in the specific structure.
            You can find an example in tests.py.
        cover_code -- is a wrapper for the user function and additional operations before give data
            in the user function. You can use some predefined codes from checkio.referee.cover_codes
        checker -- is replacement for the default checking of an user function result. If given, then
            instead simple "==" will be using the checker function which return tuple with result
            (false or true) and some additional info (some message).
            You can use some predefined codes from checkio.referee.checkers
        add_allowed_modules -- additional module which will be allowed for your task.
        add_close_builtins -- some closed builtin words, as example, if you want, you can close "eval"
        remove_allowed_modules -- close standard library modules, as example "math"

checkio.referee.checkers
    checkers.float_comparison -- Checking function fabric for check result with float numbers.
        Syntax: checkers.float_comparison(digits) -- where "digits" is a quantity of significant
            digits after coma.

checkio.referee.cover_codes
    cover_codes.unwrap_args -- Your "input" from test can be given as a list. if you want unwrap this
        before user function calling, then using this function. For example: if your test's input
        is [2, 2] and you use this cover_code, then user function will be called as checkio(2, 2)
    cover_codes.unwrap_kwargs -- the same as unwrap_kwargs, but unwrap dict.

"""

from checkio.signals import ON_CONNECT
from checkio import api
from checkio.referees.io import CheckiOReferee
from checkio.referees import cover_codes
from checkio.referees import checkers

from tests import TESTS

cover = """def cover(f, data):
    return f(tuple(tuple(d) for f in data))"""


def checker(data, user_result):
    connections, best_size = data
    if not isinstance(user_result, (tuple, list)) or not all(isinstance(n, int) for n in user_result):
        return False, "You should return a list/tuple of integers."
    if not best_size and user_result:
        return False, "Where did you find a cycle here?"
    if not best_size and not user_result:
        return True, "Ok"
    if len(user_result) < best_size + 1:
        return False, "You can find a better loop."
    if user_result[0] != user_result[-1]:
        return False, "A cycle starts and ends in the same node."
    if len(set(user_result)) != len(user_result) - 1:
        return False, "Repeat! Yellow card!"
    for n1, n2 in zip(user_result[:-1], user_result[1:]):
        if [n1, n2] not in connections and [n2, n1] not in connections:
            return False, "{}-{} is not exist".format(n1, n2)
    return True, "Ok"


api.add_listener(
    ON_CONNECT,
    CheckiOReferee(
        tests=TESTS,
        cover_code={
            'python-27': None,
            'python-3': None
        },
        checker=checker,
        function_name="find_cycle"
        # add_allowed_modules=[],
        # add_close_builtins=[],
        # remove_allowed_modules=[]
    ).on_ready)
