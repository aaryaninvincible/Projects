import pandas as pd
import numpy as np

def execute_code(df: pd.DataFrame, code: str) -> pd.DataFrame:
    """
    Executes pandas code on a dataframe in a restricted environment.
    """
    
    # Allowed imports and variables
    local_scope = {
        "df": df,
        "pd": pd,
        "np": np
    }
    
    # We want to restrict __builtins__ to prevent access to file system etc.
    # However, pandas needs some builtins. We'll be reasonably restrictive but practical.
    # A true secure sandbox requires OS-level isolation (Docker, etc.), but for this
    # MVP we will use python-level restrictions and trust the AI logic + prompt engineering.
    
    safe_builtins = {
        "range": range,
        "len": len,
        "int": int,
        "float": float,
        "str": str,
        "list": list,
        "dict": dict,
        "set": set,
        "tuple": tuple,
        "bool": bool,
        "abs": abs,
        "round": round,
        "min": min,
        "max": max,
        "sum": sum,
        "all": all,
        "any": any,
        # Blocks: open, __import__, eval, exec, etc.
    }
    
    global_scope = {
        "__builtins__": safe_builtins,
        "pd": pd,
        "np": np
    }

    try:
        exec(code, global_scope, local_scope)
        
        # After execution, ‘df’ in local_scope should be the modified one
        new_df = local_scope.get("df")
        
        if not isinstance(new_df, pd.DataFrame):
            raise ValueError("The code did not result in a valid Pandas DataFrame.")
            
        return new_df
        
    except Exception as e:
        # Re-raise with a clear message
        raise RuntimeError(f"Error executing AI code: {str(e)}")
